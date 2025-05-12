package com.sitecraft.backend.Controllers;

import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.User;
import com.sitecraft.backend.Services.StoreService;
import com.sitecraft.backend.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {

    @Autowired
    private StoreService storeService;

    // POST request for adding a user
    @PostMapping
    public Store addStore(@RequestBody Store store) {
        return storeService.addStore(store);
    }

    // GET request for retrieving all users
    @GetMapping
    public List<Store> getAllStores() {
        return storeService.getAllStores();
    }
}
