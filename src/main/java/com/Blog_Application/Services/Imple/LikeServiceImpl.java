package com.Blog_Application.Services.Imple;

import com.Blog_Application.BlogServices.LikeService;
import com.Blog_Application.Entities.Like;
import com.Blog_Application.Entities.Post;
import com.Blog_Application.Entities.User;
import com.Blog_Application.Exception.ResourceNotFoundException;
import com.Blog_Application.Repository.LikeRepo;
import com.Blog_Application.Repository.PostRepo;
import com.Blog_Application.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.nio.file.ReadOnlyFileSystemException;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class LikeServiceImpl implements LikeService {
    private final LikeRepo likeRepo;
    private final PostRepo postRepo;
    private final UserRepo userRepo;

    @Override
    public boolean toggleLike(int postId, int userId){
        Post post = postRepo.findById(postId).orElseThrow(()-> new ResourceNotFoundException("Post", "id", postId));
        User user = userRepo.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User", "id", userId));
        Optional<Like> existingLike = likeRepo.findByPostAndUser(post, user);
        if(existingLike.isPresent()){
            likeRepo.delete(existingLike.get());
            return false;
        }
        else {
            Like newLike = new Like();
            newLike.setPost(post);
            newLike.setUser(user);
            likeRepo.save(newLike);
            return true;
        }
    }
}
