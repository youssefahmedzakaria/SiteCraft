package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.SiteCraftSubscription;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.PaymentLog;
import com.sitecraft.backend.Repositories.SiteCraftSubscriptionRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Repositories.PaymentLogRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Service
public class SiteCraftSubscriptionService {
    @Autowired
    private SiteCraftSubscriptionRepo subscriptionRepo;
    @Autowired
    private StoreRepo storeRepo;
    @Autowired
    private PaymentLogRepo paymentLogRepo;

    public SiteCraftSubscription createSubscription(Long storeId, String plan, String period, Double price, String method) {
        Optional<Store> storeOpt = storeRepo.findById(storeId);
        if (storeOpt.isEmpty()) throw new RuntimeException("Store not found");
        Store store = storeOpt.get();

        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = period.equalsIgnoreCase("annual") ? startDate.plusYears(1) : startDate.plusMonths(1);

        // Create PaymentLog
        PaymentLog payment = new PaymentLog();
        payment.setAmount(price);
        payment.setTimestamp(startDate);
        payment.setStatus("completed");
        payment.setMethod(method);
        payment.setStore(store);
        paymentLogRepo.save(payment);

        // Create Subscription
        SiteCraftSubscription sub = new SiteCraftSubscription();
        sub.setStore(store);
        sub.setPlan(plan);
        sub.setStartDate(Timestamp.valueOf(startDate));
        sub.setEndDate(Timestamp.valueOf(endDate));
        sub.setStatus("active");
        sub.setPaymentLog(payment);
        subscriptionRepo.save(sub);

        // Update store status to active
        store.setStatus("active");
        storeRepo.save(store);

        return sub;
    }

    public Optional<SiteCraftSubscription> getCurrentSubscription(Long storeId) {
        return subscriptionRepo.findAll().stream()
            .filter(sub -> sub.getStore().getId().equals(storeId))
            .filter(sub -> sub.getStatus().equalsIgnoreCase("active"))
            .findFirst();
    }

    public void cancelSubscription(Long storeId) {
        Optional<SiteCraftSubscription> currentSub = getCurrentSubscription(storeId);
        if (currentSub.isPresent()) {
            SiteCraftSubscription sub = currentSub.get();
            sub.setStatus("cancelled");
            subscriptionRepo.save(sub);

            // Update store status to inactive
            Optional<Store> storeOpt = storeRepo.findById(storeId);
            if (storeOpt.isPresent()) {
                Store store = storeOpt.get();
                store.setStatus("inactive");
                storeRepo.save(store);
            }
        }
    }

    public void checkAndUpdateExpiredSubscriptions() {
        LocalDateTime now = LocalDateTime.now();
        List<SiteCraftSubscription> activeSubscriptions = subscriptionRepo.findAll().stream()
            .filter(sub -> sub.getStatus().equalsIgnoreCase("active"))
            .toList();

        for (SiteCraftSubscription sub : activeSubscriptions) {
            if (sub.getEndDate().toLocalDateTime().isBefore(now)) {
                // Subscription has expired
                sub.setStatus("expired");
                subscriptionRepo.save(sub);

                // Update store status to inactive
                Store store = sub.getStore();
                store.setStatus("inactive");
                storeRepo.save(store);
            }
        }
    }

    // Scheduled task to check for expired subscriptions daily at 2 AM
    @Scheduled(cron = "0 0 2 * * ?")
    public void scheduledCheckExpiredSubscriptions() {
        checkAndUpdateExpiredSubscriptions();
    }
} 