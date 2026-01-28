package com.postly.Repository;

import com.postly.Entities.Post;
import com.postly.Entities.SavedPost;
import com.postly.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedPostRepo extends JpaRepository<SavedPost, Integer> {

    // Check if user already saved this post
    Optional<SavedPost> findByUserAndPost(User user, Post post);

    // Get all saved posts by a user
    List<SavedPost> findByUser(User user);
}