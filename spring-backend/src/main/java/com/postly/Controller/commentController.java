package com.postly.Controller;

import com.postly.Security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.postly.BlogServices.commentsServices;
import com.postly.Payload.CommentDto;
import com.postly.Payload.ApiResponse;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("home/api")
public class commentController {

	private final commentsServices cServices;

	// For admin use
	//@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/comments/all")
	public ResponseEntity<List<CommentDto>> getAllComments() {
		List<CommentDto> allComments = cServices.getAllComments();
		return new ResponseEntity<>(allComments, HttpStatus.OK);
	}

	@GetMapping("/user/{userId}/comments")
	public ResponseEntity<List<CommentDto>> getCommentsByUser(@PathVariable int userId) {
		List<CommentDto> comments = cServices.getCommentsByUser(userId);
		return new ResponseEntity<>(comments, HttpStatus.OK);
	}

	@PostMapping("POST/{id}/comments")
	public ResponseEntity<CommentDto> addComment(
			@Valid @RequestBody CommentDto cDto,
            @PathVariable int id,
			Authentication authentication
	)
	{
		// 1. Extract User ID from Token
		UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
		int userId = Integer.parseInt(principal.getUserId());
		// 2. Pass userId to service
		CommentDto ans = this.cServices.addCommentDto(cDto, id, userId);
		return new ResponseEntity<>(ans, HttpStatus.CREATED);
	}

	@DeleteMapping("comments/{commentId}") // Standard REST pattern
	public ApiResponse deleteCommentInController(@PathVariable int commentId) {
		this.cServices.deleteComment(commentId);
		return new ApiResponse("comment deleted successfully", true);
	}
}