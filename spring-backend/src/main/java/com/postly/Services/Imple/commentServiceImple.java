package com.postly.Services.Imple;

import com.postly.Entities.User;
import com.postly.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.postly.BlogServices.commentsServices;
import com.postly.Entities.Comment;
import com.postly.Entities.Post;
import com.postly.Exception.ResourceNotFoundException;
import com.postly.Payload.CommentDto;
import com.postly.Repository.CommentsRepo;
import com.postly.Repository.PostRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import com.postly.Exception.ApiException;

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
		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

		Comment com = model.map(cDto, Comment.class);
		com.setPost(post);
		com.setUser(user);
		Comment saveComment = cRepo.save(com);
		return model.map(saveComment, CommentDto.class);
	}

	public void deleteComment(int id) {
		Comment comment = this.cRepo.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("Comment","id",id));

		String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

		User currentUser = userRepo.findByEmail(currentEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email : " + currentEmail, 0));

		boolean isCommentOwner = currentUser.getId() == comment.getUser().getId();
		boolean isPostOwner = currentUser.getId() == comment.getPost().getUser().getId();
		boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

		if (!isCommentOwner && !isAdmin && !isPostOwner) {
			throw new ApiException("You are not authorized to delete this comment");
		}

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