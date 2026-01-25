package com.Blog_Application.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.Blog_Application.Entities.Category;
import com.Blog_Application.Entities.Post;
import com.Blog_Application.Entities.User;

public interface PostRepo extends JpaRepository<Post, Integer>{

	Page<Post> findByUser(User user, Pageable pageable);
	public List<Post> findByCategory(Category category);
}
