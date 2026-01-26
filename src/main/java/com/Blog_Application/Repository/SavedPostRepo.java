package com.Blog_Application.Repository;

import com.Blog_Application.Entities.Post;
import com.Blog_Application.Entities.SavedPost;
import com.Blog_Application.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedPostRepo extends JpaRepository<SavedPost, Integer> {

    // Check if user already saved this post
    Optional<SavedPost> findByUserAndPost(User user, Post post);

    // Get all saved posts by a user
    List<SavedPost> findByUser(User user);
}