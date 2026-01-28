package com.postly.Controller;

import com.postly.BlogServices.LikeService;
import com.postly.Payload.PostDto;
import com.postly.Security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("home/api")
public class LikeController {
    private final LikeService likeService;

    @GetMapping("/user/liked-posts")
    public ResponseEntity<List<PostDto>> getMyLikedPosts(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        int userId = Integer.parseInt(principal.getUserId());

        List<PostDto> likedPosts = likeService.getLikedPosts(userId);
        return new ResponseEntity<>(likedPosts, HttpStatus.OK);
    }

    @PostMapping("/post/{postId}/like")
    public ResponseEntity<String> toggleLike(
            @PathVariable int postId,
            Authentication authentication
    )
    {
        // 1. Extract User ID from Token
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        int userId = Integer.parseInt(principal.getUserId());

        boolean isLiked = likeService.toggleLike(postId, userId);
        if(isLiked){
            return new ResponseEntity<>("Post Liked Successfully", HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Post Unliked Successfully", HttpStatus.OK);
        }
    }
}