package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<Users, Long> {

    Users getUserByEmail(String email);
}
