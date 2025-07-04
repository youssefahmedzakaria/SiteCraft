package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UserRepo extends JpaRepository<Users, Long> {
    Users findByEmail(String email); // More idiomatic
    List<Users> findAllByEmail(String email); // Get all users with same email
}
