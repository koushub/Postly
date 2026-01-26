package com.Blog_Application.Repository;

import com.Blog_Application.Entities.Like;
import com.Blog_Application.Entities.Post;
import com.Blog_Application.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LikeRepo extends JpaRepository<Like, Integer> {
    Optional<Like> findByPostAndUser(Post post, User user);
    List<Like> findByUser(User user);
}
