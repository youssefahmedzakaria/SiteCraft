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

//    public Store updateStore(Store updatedStore) {
//        Store store = storeRepo.findById(storeId).get();
//
//    }
}


