package com.sitecraft.backend.Services;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Repositories.StoreRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StoreService {
    @Autowired
    private StoreRepo storeRepo;

    public List<Store> getAllStores() {
        return storeRepo.findAll(); // Automatically provided by JpaRepository
    }

    public Store addStore(Store store) {
        return storeRepo.save(store); // Automatically provided by JpaRepository
    }
}


