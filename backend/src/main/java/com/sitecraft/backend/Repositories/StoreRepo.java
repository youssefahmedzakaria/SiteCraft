package com.sitecraft.backend.Repositories;
import com.sitecraft.backend.Models.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StoreRepo extends JpaRepository<Store, Long> {

}
