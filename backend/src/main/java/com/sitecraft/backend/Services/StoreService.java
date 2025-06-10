package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Repositories.UserRoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StoreService {
    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;

    @Autowired
    private TenantDatabaseService tenantDatabaseService;

    public List<Store> getAllStores() {
        return storeRepo.findAll(); // Automatically provided by JpaRepository
    }

    public Store createStore(Store store, Long userId) {
        try {
            store.setCreationDate(LocalDateTime.now());

            // First save to get the ID
            Store savedStore = storeRepo.save(store);

            // Generate database name from store name + id
            String cleanStoreName = savedStore.getStoreName()
                    .replaceAll("[^a-zA-Z0-9]", "")  // Remove special characters and spaces
                    .toLowerCase();  // Convert to lowercase
            String databaseName = cleanStoreName + savedStore.getId();

            // Create the database
            tenantDatabaseService.createUserDatabaseAndSchema(
                    databaseName,
                    "postgres",
                    "123456"
            );

            // Update store with database information
            savedStore.setDatabaseName(databaseName);
            savedStore.setDatabaseUrl("jdbc:postgresql://localhost:5432/" + databaseName);

            // Create admin role for the user
            UserRole adminRole = new UserRole("Owner", userId, savedStore.getId());
            userRoleRepo.save(adminRole);

            // Save again with database info
            return storeRepo.save(savedStore);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create store: " + e.getMessage());
        }
    }
}


