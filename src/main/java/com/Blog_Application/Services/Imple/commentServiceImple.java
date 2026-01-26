package com.Blog_Application.Services.Imple;

import com.Blog_Application.Entities.User;
import com.Blog_Application.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.Blog_Application.BlogServices.commentsServices;
import com.Blog_Application.Entities.Comment;
import com.Blog_Application.Entities.Post;
import com.Blog_Application.Exception.ResourceNotFoundException;
import com.Blog_Application.Payload.CommentDto;
import com.Blog_Application.Repository.CommentsRepo;
import com.Blog_Application.Repository.PostRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import com.Blog_Application.Exception.ApiException;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class commentServiceImple implements commentsServices {

	private final CommentsRepo cRepo;
	private final PostRepo psPost;
	private final UserRepo userRepo;
	private final ModelMapper model;

	@Override
	public List<CommentDto> getCommentsByUser(int userId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		List<Comment> comments = cRepo.findByUser(user);

		return comments.stream()
				.map(comment -> model.map(comment, CommentDto.class))
				.collect(Collectors.toList());
	}

	public CommentDto addCommentDto(CommentDto cDto, int postId, int userId) {
		Post post = this.psPost.findById(postId).orElseThrow(()-> new ResourceNotFoundException("Post", "id", postId));
		// 1. Fetch User
		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

		Comment com = model.map(cDto, Comment.class);
		com.setPost(post);
		com.setUser(user);
		Comment saveComment = cRepo.save(com);
		return model.map(saveComment, CommentDto.class);
	}

	public void deleteComment(int id) {
		// 1. Find Comment
		Comment comment = this.cRepo.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("Comment","id",id));

		// --- SECURITY CHECK START ---

		// 2. Get Current User Email
		String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

		// 3. Find Current User
		User currentUser = userRepo.findByEmail(currentEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email : " + currentEmail, 0));

		// 4. Check Permissions
		// Owner of the comment?
		boolean isCommentOwner = currentUser.getId() == comment.getUser().getId();
		// Owner of the POST the comment is on? (Optional: usually post owners can delete comments on their posts)
		boolean isPostOwner = currentUser.getId() == comment.getPost().getUser().getId();
		// Is Admin?
		boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

		if (!isCommentOwner && !isAdmin && !isPostOwner) {
			throw new ApiException("You are not authorized to delete this comment");
		}
		// --- SECURITY CHECK END ---

		this.cRepo.delete(comment);
	}

	@Override
	public List<CommentDto> getAllComments() {
		List<Comment> comments = cRepo.findAll();
		return comments.stream()
				.map(comment -> model.map(comment, CommentDto.class))
				.collect(Collectors.toList());
	}
}