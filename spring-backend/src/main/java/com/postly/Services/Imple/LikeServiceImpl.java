package com.postly.Services.Imple;

import com.postly.BlogServices.LikeService;
import com.postly.Entities.Like;
import com.postly.Entities.Post;
import com.postly.Entities.User;
import com.postly.Exception.ResourceNotFoundException;
import com.postly.Payload.PostDto;
import com.postly.Repository.LikeRepo;
import com.postly.Repository.PostRepo;
import com.postly.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class LikeServiceImpl implements LikeService {
    private final LikeRepo likeRepo;
    private final PostRepo postRepo;
    private final UserRepo userRepo;
    private final ModelMapper modelMapper;

    @Override
    public List<PostDto> getLikedPosts(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        List<Like> likes = likeRepo.findByUser(user);

        return likes.stream()
                .map(like -> modelMapper.map(like.getPost(), PostDto.class))
                .collect(Collectors.toList());
    }

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
