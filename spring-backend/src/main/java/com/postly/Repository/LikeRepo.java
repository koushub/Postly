package com.postly.Repository;

import com.postly.Entities.Like;
import com.postly.Entities.Post;
import com.postly.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LikeRepo extends JpaRepository<Like, Integer> {
    Optional<Like> findByPostAndUser(Post post, User user);
    List<Like> findByUser(User user);
}
