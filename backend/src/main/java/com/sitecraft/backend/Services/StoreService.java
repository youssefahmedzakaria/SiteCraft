package com.sitecraft.backend.Services;
import com.sitecraft.backend.DTOs.StoreInfoDTO;
import com.sitecraft.backend.Models.*;
import com.sitecraft.backend.Repositories.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
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

    @Autowired
    private ShippingInfoRepo shippingInfoRepo;

    @Autowired
    private PolicyRepo policyRepository;

    @Autowired
    private AboutUsRepo aboutUsRepository;

    public Store createStore(Store store, Long userId) {
        try {
            store.setCreationDate(LocalDateTime.now());

            Store savedStore = storeRepo.save(store);
            Users tempUser = new Users();
            tempUser.setId(userId);

            UserRole ownerRole = new UserRole("owner", tempUser, savedStore);
            userRoleRepo.save(ownerRole);

            return storeRepo.save(savedStore);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create store: " + e.getMessage());
        }
    }

    // ------------------------------ Account Settings ------------------------------------------------

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

    // --------------------------------- Shipping Info -----------------------------------------------

    public List<ShippingInfo> getShippingInfosByStoreId(Long storeId) {
        try {
            return shippingInfoRepo.findByStoreId(storeId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get shipping infos by store: " + e.getMessage());
        }
    }

    public ShippingInfo addShippingInfo(ShippingInfo shippingInfo) {
        try {
            return shippingInfoRepo.save(shippingInfo);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add shipping info: " + e.getMessage());
        }
    }

    @Transactional
    public void updateShippingInfo(Long shippingInfoId, ShippingInfo updatedInfo, Long storeId) {
        try {
            ShippingInfo existing = shippingInfoRepo.findById(shippingInfoId)
                    .orElseThrow(() -> new RuntimeException("Shipping Info not found"));

            if (!existing.getStore().getId().equals(storeId)) {
                throw new IllegalAccessException("Shipping Info does not belong to your store");
            }

            if (updatedInfo.getShippingPrice() != null) existing.setShippingPrice(updatedInfo.getShippingPrice());
            if (updatedInfo.getGovernmentName() != null) existing.setGovernmentName(updatedInfo.getGovernmentName());
            existing.setEstimatedDeliveryTime(updatedInfo.getEstimatedDeliveryTime());
        } catch (Exception e) {
            throw new RuntimeException("Failed to update shipping info: " + e.getMessage());
        }
    }

    public void deleteShippingInfo(Long shippingInfoId, Long storeId) {
        try {
            ShippingInfo existing = shippingInfoRepo.findById(shippingInfoId)
                    .orElseThrow(() -> new RuntimeException("Shipping Info not found"));

            if (!existing.getStore().getId().equals(storeId)) {
                throw new IllegalAccessException("Shipping Info does not belong to your store");
            }
            shippingInfoRepo.deleteById(shippingInfoId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete shipping info: " + e.getMessage());
        }
    }

    // --------------------------------- Store Info -----------------------------------------------

    public StoreInfoDTO getStoreInfoByStoreId(Long storeId) {
        try {
            List<Policy> policies = policyRepository.findByStoreId(storeId);
            List<AboutUs> aboutUsList = aboutUsRepository.findByStoreId(storeId);

            return new StoreInfoDTO(policies, aboutUsList);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch store info: " + e.getMessage());
        }
    }


//    public Optional<ShippingInfo> getShippingInfoById(Long id) {
//        return shippingInfoRepo.findById(id);
//    }

}


