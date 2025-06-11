package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Repositories.StoreRepo;
import com.sitecraft.backend.Repositories.UserRoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;


@Service
public class StoreService {
    @Autowired
    private StoreRepo storeRepo;

    @Autowired
    private UserRoleRepo userRoleRepo;

    @Autowired
    private TenantDatabaseService tenantDatabaseService;

    public Store createStore(Store store, Long userId) {
        try {
            store.setCreationDate(LocalDateTime.now());

            Store savedStore = storeRepo.save(store);

            String cleanStoreName = savedStore.getStoreName()
                    .replaceAll("[^a-zA-Z0-9]", "")  // Remove special characters and spaces
                    .toLowerCase();  // Convert to lowercase
            String databaseName = cleanStoreName + savedStore.getId();

            tenantDatabaseService.createUserDatabaseAndSchema(
                    databaseName,
                    "postgres",
                    "123456"
            );

            savedStore.setDatabaseName(databaseName);
            savedStore.setDatabaseUrl("jdbc:postgresql://localhost:5432/" + databaseName);

            UserRole adminRole = new UserRole("owner", userId, savedStore.getId());
            userRoleRepo.save(adminRole);

            return storeRepo.save(savedStore);

        } catch (Exception e) {
            throw new RuntimeException("Failed to create store: " + e.getMessage());
        }
    }
}


