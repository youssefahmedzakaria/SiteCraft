package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRoleRepo extends JpaRepository<UserRole, Long> {
    UserRole findByUser(Users userId);
    List<UserRole> findByRoleAndStoreId(String role, Long storeId);

    void deleteByUserAndStoreId(Users userId, Long storeId);
}