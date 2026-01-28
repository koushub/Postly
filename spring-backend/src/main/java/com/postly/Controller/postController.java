package com.postly.Controller;

import java.util.List;

import com.postly.Security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.postly.BlogServices.postServices;
import com.postly.Payload.ApiResponse;
import com.postly.Payload.PostDto;
import com.postly.Payload.PostResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/home/api")
@CrossOrigin(origins = "http://localhost:5173")
public class postController {

	private final postServices pServices;

	@PostMapping("/category/{categoryId}/POST")
	public ResponseEntity<PostDto> uploadPost(
			@Valid @RequestBody PostDto post,
			@PathVariable int categoryId,
			Authentication authentication) {

		UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
		int loggedInUserId = Integer.parseInt(principal.getUserId());

		PostDto post1 = this.pServices.createPost(post, loggedInUserId, categoryId);
		return new ResponseEntity<>(post1, HttpStatus.CREATED);
	}

	@PutMapping("POST/{postId}")
	public ResponseEntity<PostDto> updatePostInController(
			@Valid @RequestBody PostDto psDto,
			@PathVariable("postId") int id)
	{
		PostDto updateDto = this.pServices.updatePost(psDto, id);
		return new ResponseEntity<>(updateDto, HttpStatus.OK);
	}

	@GetMapping("POST/{postId}")
	public ResponseEntity<PostDto> getSinglePostInController(@PathVariable("postId") int id){
		PostDto pDto = this.pServices.getByIdPost(id);
		return new ResponseEntity<>(pDto, HttpStatus.OK);
	}

	@GetMapping("POST")
	public ResponseEntity<PostResponse> getAllPostInController(
			@RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "9", required = false) Integer pageSize,
			@RequestParam(value = "sortBy", defaultValue = "postId", required = false) String sortBy,
			@RequestParam(value = "sortDir", defaultValue = "desc", required = false) String sortDir
	){
		PostResponse postResponse = this.pServices.getAllPost(pageNumber, pageSize, sortBy, sortDir);
		return new ResponseEntity<>(postResponse, HttpStatus.OK);
	}

	@DeleteMapping("POST/{postId}")
	public ApiResponse deletePostInController(@PathVariable("postId") int id) {
		this.pServices.delete(id);
		return new ApiResponse("this post deleted successfully", true);
	}

	@GetMapping("user/{userId}/POST")
	public ResponseEntity<PostResponse> getPostByUser(
			@PathVariable("userId") int id,
			@RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
			@RequestParam(value = "pageSize", defaultValue = "5", required = false) Integer pageSize
	){
		PostResponse postResponse = this.pServices.getPostByUser(id, pageNumber, pageSize);
		return new ResponseEntity<>(postResponse, HttpStatus.OK);
	}

	@GetMapping("Category/{categoryId}/POST")
	public ResponseEntity<List<PostDto>> getPostByCategory(@PathVariable("categoryId") int id){
		List<PostDto> allPostsInCategory = this.pServices.getPostByCategory(id);
		return new ResponseEntity<>(allPostsInCategory, HttpStatus.OK);
	}
}