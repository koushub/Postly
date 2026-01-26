package com.Blog_Application.Services.Imple;

import com.Blog_Application.BlogServices.SavedPostService;
import com.Blog_Application.Entities.Post;
import com.Blog_Application.Entities.SavedPost;
import com.Blog_Application.Entities.User;
import com.Blog_Application.Exception.ResourceNotFoundException;
import com.Blog_Application.Payload.PostDto;
import com.Blog_Application.Repository.PostRepo;
import com.Blog_Application.Repository.SavedPostRepo;
import com.Blog_Application.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedPostServiceImpl implements SavedPostService {

    private final SavedPostRepo savedPostRepo;
    private final UserRepo userRepo;
    private final PostRepo postRepo;
    private final ModelMapper modelMapper;

    @Override
    public boolean toggleSave(int userId, int postId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Post post = postRepo.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        Optional<SavedPost> existing = savedPostRepo.findByUserAndPost(user, post);

        if (existing.isPresent()) {
            // Already saved -> Unsave it
            savedPostRepo.delete(existing.get());
            return false; // Unsaved
        } else {
            // Not saved -> Save it
            SavedPost savedPost = new SavedPost();
            savedPost.setUser(user);
            savedPost.setPost(post);
            savedPost.setSavedDate(new Date());
            savedPostRepo.save(savedPost);
            return true; // Saved
        }
    }

    @Override
    public List<PostDto> getSavedPosts(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<SavedPost> savedPosts = savedPostRepo.findByUser(user);

        // Convert SavedPost entities -> Post entities -> PostDtos
        return savedPosts.stream()
                .map(saved -> modelMapper.map(saved.getPost(), PostDto.class))
                .collect(Collectors.toList());
    }
}