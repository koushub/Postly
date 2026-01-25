package com.Blog_Application.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Blog_Application.Entities.Category;

import java.util.List;

public interface CategoryRepo extends JpaRepository<Category, Integer> {
    List<Category> findByIsDeletedFalse();
}
