package com.postly.Controller;

import com.postly.BlogServices.SavedPostService;
import com.postly.Payload.ApiResponse;
import com.postly.Payload.PostDto;
import com.postly.Security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home/api")
@RequiredArgsConstructor
public class SavedPostController {

    private final SavedPostService savedPostService;

    // Toggle Save (Like the Like button, but for saving)
    @PostMapping("/post/{postId}/save")
    public ResponseEntity<ApiResponse> toggleSavePost(@PathVariable int postId, Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        int userId = Integer.parseInt(principal.getUserId());

        boolean isSaved = savedPostService.toggleSave(userId, postId);

        if (isSaved) {
            return new ResponseEntity<>(new ApiResponse("Post saved successfully", true), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiResponse("Post removed from saved list", true), HttpStatus.OK);
        }
    }

    // Get All Saved Posts for the logged-in user
    @GetMapping("/user/saved-posts")
    public ResponseEntity<List<PostDto>> getMySavedPosts(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        int userId = Integer.parseInt(principal.getUserId());

        List<PostDto> savedPosts = savedPostService.getSavedPosts(userId);
        return new ResponseEntity<>(savedPosts, HttpStatus.OK);
    }
}