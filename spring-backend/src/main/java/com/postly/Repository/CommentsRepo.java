package com.postly.Repository;

import com.postly.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.postly.Entities.Comment;

import java.util.List;

public interface CommentsRepo extends JpaRepository<Comment, Integer> {
    List<Comment> findByUser(User user);
}
