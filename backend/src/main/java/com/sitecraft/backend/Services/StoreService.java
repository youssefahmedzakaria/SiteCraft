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

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductRepo productRepo;

    @Autowired
    private SiteCraftSubscriptionService subscriptionService;

    public Store createStore(Store store, Long userId) {
        System.out.println("🏪 StoreService.createStore called for user ID: " + userId);
        try {
            store.setCreationDate(LocalDateTime.now());
            store.setStatus("active");
            
            // Set default colors if not provided
            String colors = store.getColors();
            if (colors == null || colors.isEmpty()) {
                colors = "{\"primary\": \"#000000\", \"secondary\": \"#ffffff\", \"accent\": \"#ff6b6b\"}";
            }
            
            System.out.println("📅 Store creation date set");
            System.out.println("✅ Store status set to active");
            System.out.println("🎨 Store colors to be set: " + colors);

            // Save the store without colors (because colors field is insertable = false)
            Store savedStore = storeRepo.save(store);
            System.out.println("✅ Store saved with ID: " + savedStore.getId());
            
            // Now update the colors using native query
            storeRepo.updateStoreColors(savedStore.getId(), colors);
            System.out.println("🎨 Store colors updated using native query");
            
            // Refresh the store to get the updated colors
            savedStore = storeRepo.findById(savedStore.getId()).orElse(savedStore);
            
            Users tempUser = new Users();
            tempUser.setId(userId);

            UserRole ownerRole = new UserRole("owner", tempUser, savedStore.getId());
            userRoleRepo.save(ownerRole);
            System.out.println("👑 Owner role created for user ID: " + userId + " and store ID: " + savedStore.getId());

            return savedStore;

        } catch (Exception e) {
            System.out.println("💥 Error creating store: " + e.getMessage());
            e.printStackTrace();
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
        if (updatedData.getSubdomain() != null) existingStore.setSubdomain(updatedData.getSubdomain());
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

    public List<Policy> getStorePolicies(Long storeId) {
        try {
            List<Policy> policies = policyRepository.findByStoreId(storeId);
            return policies;
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch store policies: " + e.getMessage());
        }
    }

    public Policy getStorePolicyById(Long policyId, Long storeId) {
        try {
            return policyRepository.findByIdAndStoreId(policyId, storeId)
                    .orElseThrow(() -> new IllegalAccessException("Policy not found or does not belong to your store"));
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch store policy: " + e.getMessage());
        }
    }

    public Policy addPolicy(Policy policy) {
        try {
            return policyRepository.save(policy);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add policy: " + e.getMessage());
        }
    }

    @Transactional
    public void updatePolicyById(Long policyId, Policy updatedPolicy, Long storeId) {
        try {
            Policy existing = policyRepository.findByIdAndStoreId(policyId, storeId)
                    .orElseThrow(() -> new IllegalAccessException("Policy not found or does not belong to your store"));

            if (updatedPolicy.getTitle() != null) existing.setTitle(updatedPolicy.getTitle());
            if (updatedPolicy.getDescription() != null) existing.setDescription(updatedPolicy.getDescription());
            if (updatedPolicy.getStatus() != null) existing.setStatus(updatedPolicy.getStatus());
        } catch (Exception e) {
            throw new RuntimeException("Failed to update policy: " + e.getMessage());
        }
    }

    public void deletePolicyById(Long policyId, Long storeId) {
        try {
            policyRepository.findByIdAndStoreId(policyId, storeId)
                    .orElseThrow(() -> new IllegalAccessException("Policy not found or does not belong to your store"));
            policyRepository.deleteById(policyId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete policy: " + e.getMessage());
        }
    }

    public List<AboutUs> getAboutUsListByStoreId(Long storeId) {
        try {
            return aboutUsRepository.findByStoreId(storeId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch About Us entries: " + e.getMessage());
        }
    }

    public AboutUs getAboutUsById(Long aboutUsId, Long storeId) {
        try {
            return aboutUsRepository.findByIdAndStoreId(aboutUsId, storeId)
                    .orElseThrow(() -> new IllegalAccessException("About Us entry not found or does not belong to your store"));
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch About Us entry: " + e.getMessage());
        }
    }

    public AboutUs addAboutUs(AboutUs aboutUs) {
        try {
            return aboutUsRepository.save(aboutUs);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add About Us entry: " + e.getMessage());
        }
    }

    @Transactional
    public void updateAboutUs(Long aboutUsId, AboutUs updated, Long storeId) {
        try {
            AboutUs existing = aboutUsRepository.findByIdAndStoreId(aboutUsId, storeId)
                    .orElseThrow(() -> new IllegalAccessException("About Us entry not found or does not belong to your store"));

            if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
            if (updated.getContent() != null) existing.setContent(updated.getContent());
            if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
            if (updated.getType() != null) existing.setType(updated.getType());
        } catch (Exception e) {
            throw new RuntimeException("Failed to update About Us entry: " + e.getMessage());
        }
    }

    public void deleteAboutUs(Long aboutUsId, Long storeId) {
        try {
            aboutUsRepository.findByIdAndStoreId(aboutUsId, storeId)
                    .orElseThrow(() -> new IllegalAccessException("About Us entry not found or does not belong to your store"));
            aboutUsRepository.deleteById(aboutUsId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete About Us entry: " + e.getMessage());
        }
    }

    public List<Store> getAllStores() {
        return storeRepo.findAll();
    }

    public String getOwnerEmail(Long storeId) {
        // Find the first user with 'owner' role for this store
        List<UserRole> ownerRoles = userRoleRepo.findByRoleAndStoreId("owner", storeId);
        if (ownerRoles != null && !ownerRoles.isEmpty() && ownerRoles.get(0).getUser() != null) {
            return ownerRoles.get(0).getUser().getEmail();
        }
        return null;
    }

    @Transactional
    public void updateStoreStatus(Long storeId, String status) {
        Store store = storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
        store.setStatus(status);
        storeRepo.save(store);
    }

    public com.sitecraft.backend.DTOs.StoreStatsDTO getStoreStats(Long storeId) {
        // Total staff
        int totalStaff = userRoleRepo.findByRoleAndStoreId("staff", storeId).size();

        // Get all orders for this store
        List<com.sitecraft.backend.Models.Order> allOrders = orderService.getAllOrders(storeId);
        int totalOrders = allOrders.size();
        double totalSales = allOrders.stream().mapToDouble(o -> o.getPrice() != null ? o.getPrice() : 0.0).sum();

        // Last month orders and sales
        java.time.LocalDate now = java.time.LocalDate.now(java.time.ZoneId.systemDefault());
        java.time.LocalDate firstDayOfLastMonth = now.minusMonths(1).withDayOfMonth(1);
        java.time.LocalDate lastDayOfLastMonth = now.withDayOfMonth(1).minusDays(1);
        List<com.sitecraft.backend.Models.Order> lastMonthOrdersList = orderService.getOrdersByStoreAndDateRange(storeId, firstDayOfLastMonth, lastDayOfLastMonth);
        int lastMonthOrders = lastMonthOrdersList.size();
        double lastMonthSales = lastMonthOrdersList.stream().mapToDouble(o -> o.getPrice() != null ? o.getPrice() : 0.0).sum();

        // Product count
        int productCount = productRepo.findByStoreId(storeId).size();

        // Current plan
        String currentPlan = "None";
        try {
            var sub = subscriptionService.getCurrentSubscription(storeId);
            if (sub.isPresent()) {
                currentPlan = sub.get().getPlan();
            }
        } catch (Exception ignored) {}

        // Plan recommendation
        String planRecommendation = null;
        if (productCount > 100) planRecommendation = "Recommend: Pro Plan (for large catalogs)";
        else if (productCount < 10) planRecommendation = "Recommend: Starter Plan (for small stores)";
        else planRecommendation = "Current plan is suitable.";

        // Offer recommendation
        String offerRecommendation = null;
        if (lastMonthSales < 1000) {
            offerRecommendation = "You are eligible for a 20% discount on your next subscription renewal!";
        } else {
            offerRecommendation = "Unlock advanced analytics or premium support for your growing business!";
        }

        // Advice for low sales
        String advice = null;
        if (lastMonthSales < 1000) advice = "Sales are low. Try social media marketing, bundle offers, or free shipping.";
        else advice = "Keep up the good work!";

        return new com.sitecraft.backend.DTOs.StoreStatsDTO(
            totalStaff, totalOrders, totalSales, lastMonthOrders, lastMonthSales,
            productCount, currentPlan, planRecommendation, offerRecommendation, advice
        );
    }

    // --------------------------------- Store Colors Management -----------------------------------------------

    @Transactional
    public Store updateStoreColors(Long storeId, String primary, String secondary, String accent) {
        // Create JSON string for colors
        String colorsJson = String.format(
            "{\"primary\": \"%s\", \"secondary\": \"%s\", \"accent\": \"%s\"}", 
            primary, secondary, accent
        );
        
        // Use native query to handle JSONB casting
        storeRepo.updateStoreColors(storeId, colorsJson);
        
        // Return the updated store
        return storeRepo.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found"));
    }

    public String getStoreColors(Long storeId) {
        String colors = storeRepo.getStoreColors(storeId);
        
        // Return default colors if not set
        if (colors == null || colors.isEmpty()) {
            return "{\"primary\": \"#000000\", \"secondary\": \"#ffffff\", \"accent\": \"#ff6b6b\"}";
        }
        
        return colors;
    }

}


