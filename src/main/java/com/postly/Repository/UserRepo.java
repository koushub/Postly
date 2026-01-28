package com.postly.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import com.postly.Entities.User;

public interface UserRepo extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByName(String name);
    List<User> findByIsDeletedFalse();
    Optional<User> findByEmailAndIsDeletedFalse(String email);
    List<User> findByIsDeletedTrue();
    long countByIsDeletedFalse();
}
