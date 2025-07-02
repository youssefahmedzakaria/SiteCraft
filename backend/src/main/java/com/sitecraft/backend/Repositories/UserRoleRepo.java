package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.Store;
import com.sitecraft.backend.Models.UserRole;
import com.sitecraft.backend.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRoleRepo extends JpaRepository<UserRole, Long> {
    UserRole findByUser(Users userId);
    List<UserRole> findByRoleAndStoreId(String role, Long storeId);
    UserRole findByStoreIdAndUser(Long storeId, Users userId);
    void deleteByUserAndStoreId(Users userId, Long storeId);
    List<UserRole> findByUserEmail(String email);
    List<UserRole> findByRoleAndStoreIdIsNull(String role);
    void deleteByUserAndRoleAndStoreIdIsNull(Users user, String role);
}