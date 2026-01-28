package com.postly.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.postly.Entities.Category;
import com.postly.Entities.Post;
import com.postly.Entities.User;

public interface PostRepo extends JpaRepository<Post, Integer>{

	Page<Post> findByUser(User user, Pageable pageable);
	public List<Post> findByCategory(Category category);
}
