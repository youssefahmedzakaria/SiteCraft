package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.SocialMedia;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Repositories.UserRoleRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
public class StoreService {
    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;



    public Store createStore(Store store, Long userId) {
        try {
            store.setCreationDate(LocalDateTime.now());

            Store savedStore = storeRepo.save(store);

            UserRole ownerRole = new UserRole("owner", userId, savedStore.getId());
            userRoleRepo.save(ownerRole);

            return storeRepo.save(savedStore);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create store: " + e.getMessage());
        }
    }

    @Transactional
    public Store updateStorePartial(Long storeId, Store updatedData) {
        Store existingStore = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));

        if (updatedData.getStoreName() != null) existingStore.setStoreName(updatedData.getStoreName());
        if (updatedData.getStoreType() != null) existingStore.setStoreType(updatedData.getStoreType());
        if (updatedData.getLogo() != null) existingStore.setLogo(updatedData.getLogo());
        if (updatedData.getWebAddress() != null) existingStore.setWebAddress(updatedData.getWebAddress());
        if (updatedData.getDescription() != null) existingStore.setDescription(updatedData.getDescription());
        if (updatedData.getPhoneNumber() != null) existingStore.setPhoneNumber(updatedData.getPhoneNumber());
        if (updatedData.getEmailAddress() != null) existingStore.setEmailAddress(updatedData.getEmailAddress());
        if (updatedData.getAddress() != null) existingStore.setAddress(updatedData.getAddress());
        if (updatedData.getAddressLink() != null) existingStore.setAddressLink(updatedData.getAddressLink());
        if (updatedData.getOpeningHours() != null) existingStore.setOpeningHours(updatedData.getOpeningHours());

        Map<String, SocialMedia> existingMap = existingStore.getSocialMediaAccounts().stream()
                .collect(Collectors.toMap(SocialMedia::getName, Function.identity()));

        for (SocialMedia updatedAccount : updatedData.getSocialMediaAccounts()) {
            SocialMedia existing = existingMap.get(updatedAccount.getName());
            if (existing != null) {
                existing.setLink(updatedAccount.getLink());
            } else {
                updatedAccount.setStore(existingStore);
                existingStore.getSocialMediaAccounts().add(updatedAccount);
            }
        }

        return storeRepo.save(existingStore);
    }

    public Store getStore(Long storeId) {
        Optional<Store> existingStore = storeRepo.findById(storeId);
        if (existingStore.isEmpty()) {
            throw new RuntimeException("Store not found with ID: " + storeId);
        }
        return existingStore.get();
    }

}


