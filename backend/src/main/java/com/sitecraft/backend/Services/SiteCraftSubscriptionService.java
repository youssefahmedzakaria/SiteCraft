package com.sitecraft.backend.Services;

import com.sitecraft.backend.Models.SiteCraftSubscription;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.PaymentLog;
import com.sitecraft.backend.Repositories.SiteCraftSubscriptionRepo;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Repositories.PaymentLogRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;

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
        return sub;
    }

    public Optional<SiteCraftSubscription> getCurrentSubscription(Long storeId) {
        return subscriptionRepo.findAll().stream()
            .filter(sub -> sub.getStore().getId().equals(storeId))
            .filter(sub -> sub.getStatus().equalsIgnoreCase("active"))
            .findFirst();
    }
} 