package com.postly.Services.Imple;

import com.postly.BlogServices.SavedPostService;
import com.postly.Entities.Post;
import com.postly.Entities.SavedPost;
import com.postly.Entities.User;
import com.postly.Exception.ResourceNotFoundException;
import com.postly.Payload.PostDto;
import com.postly.Repository.PostRepo;
import com.postly.Repository.SavedPostRepo;
import com.postly.Repository.UserRepo;
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