package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRoleRepo extends JpaRepository<UserRole, Long> {
    UserRole findByUserId(Users userId);
    List<UserRole> findByRoleAndStoreId(String role, Store storeId);
    void deleteByUserIdAndStoreId(Users userId, Store storeId);
}