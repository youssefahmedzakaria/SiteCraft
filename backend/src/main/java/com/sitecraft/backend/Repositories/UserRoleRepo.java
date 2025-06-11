package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRoleRepo extends JpaRepository<UserRole, Long> {
    UserRole findByUserId(Long userId);
}