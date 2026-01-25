package com.Blog_Application.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Blog_Application.Entities.Comment;

public interface CommentsRepo extends JpaRepository<Comment, Integer> {

}
