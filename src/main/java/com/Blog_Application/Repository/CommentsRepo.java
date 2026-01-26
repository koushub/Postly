package com.Blog_Application.Repository;

import com.Blog_Application.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.Blog_Application.Entities.Comment;

import java.util.List;

public interface CommentsRepo extends JpaRepository<Comment, Integer> {
    List<Comment> findByUser(User user);
}
