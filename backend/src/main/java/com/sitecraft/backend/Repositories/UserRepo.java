package com.sitecraft.backend.Repositories;

import com.sitecraft.backend.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {

    User getUserByEmail(String email);
}
