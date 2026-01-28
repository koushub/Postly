package com.Blog_Application.Controller;

import java.util.List;

import com.Blog_Application.Payload.AuthorDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Blog_Application.BlogServices.UserServices;
import com.Blog_Application.Payload.UserDto;
import com.Blog_Application.Payload.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("home/api")
public class UserController {

	private final UserServices userServices;

		@PostMapping("USER")
	public ResponseEntity<UserDto> createUserController(@Valid @RequestBody UserDto user) {
		UserDto user1 = userServices.createUser(user);
		return new ResponseEntity<>(user1, HttpStatus.CREATED);
	}

	@PutMapping("USER/{userId}")
	public ResponseEntity<UserDto> updateUserData(@Valid @RequestBody UserDto user , @PathVariable("userId") int id){
		UserDto user1 = userServices.updateuser(user, id);
		return new ResponseEntity<>(user1, HttpStatus.OK);
	}

	@GetMapping("USER/{USERId}")
	public ResponseEntity<UserDto> getUserByIdInController(@PathVariable("USERId") int userId){
		return ResponseEntity.ok(userServices.getUserById(userId));
	}

	@GetMapping("USER")
	public ResponseEntity<List<UserDto>> getAllUserInController(){
		return ResponseEntity.ok(userServices.getAlluser());
	}

	@DeleteMapping("USER/{userId}")
	public ResponseEntity<ApiResponse> deleteUserByIdInController(@PathVariable("userId") int id){
		this.userServices.deleteUser(id);
		return new ResponseEntity<>(new ApiResponse("User deleted successfully", true), HttpStatus.OK);
	}

	// Public endpoint to view author details (Safe View)
	@GetMapping("/public/users/{userId}")
	public ResponseEntity<AuthorDto> getAuthorProfile(@PathVariable int userId) {
		AuthorDto author = userServices.getAuthorProfile(userId);
		return ResponseEntity.ok(author);
	}

	// ADMIN ONLY: Unban/Restore a user
	@PutMapping("USER/{userId}/restore")
	public ResponseEntity<ApiResponse> restoreUser(@PathVariable("userId") int id) {
		this.userServices.restoreUser(id);
		return new ResponseEntity<>(new ApiResponse("User restored successfully", true), HttpStatus.OK);
	}

	// ADMIN ONLY: Get list of all banned users
	@GetMapping("USER/banned")
	public ResponseEntity<List<UserDto>> getBannedUsers() {
		return ResponseEntity.ok(userServices.getBannedUsers());
	}
}