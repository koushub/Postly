package com.postly.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.postly.Entities.Category;

import java.util.List;

public interface CategoryRepo extends JpaRepository<Category, Integer> {
    List<Category> findByIsDeletedFalse();
}
