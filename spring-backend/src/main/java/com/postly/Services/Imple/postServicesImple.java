package com.postly.Services.Imple;

import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.postly.Payload.CommentDto;
import com.postly.Payload.PostResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.postly.BlogServices.postServices;
import com.postly.Entities.Category;
import com.postly.Entities.Post;
import com.postly.Entities.User;
import com.postly.Exception.ResourceNotFoundException;
import com.postly.Payload.PostDto;
import com.postly.Repository.UserRepo;
import com.postly.Repository.CategoryRepo;
import com.postly.Repository.PostRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import com.postly.Exception.ApiException;

@RequiredArgsConstructor
@Service
public class postServicesImple implements postServices {

	private final PostRepo pRepo;
	private final ModelMapper model;
	private final CategoryRepo categoryRepo;
	private final UserRepo userRepo;

	@Override
	public PostDto createPost(PostDto postdto, int userId, int categoryId) {
		User user = userRepo.findById(userId).orElseThrow(()-> new ResourceNotFoundException("User", "id", userId));
		Category category = categoryRepo.findById(categoryId).orElseThrow(()-> new ResourceNotFoundException("Category", "id", categoryId));

		if (category.isDeleted()) {
			throw new ApiException("Cannot create post in a deleted category");
		}

		Post post = DtoToPost(postdto);
		if (post.getImageName() == null || post.getImageName().isEmpty()) {
			post.setImageName("default.png");
		}
		post.setUploadDate(new Date());
		post.setCategory(category);
		post.setUser(user);
		Post savedPost = pRepo.save(post);
		return this.PostToDto(savedPost);
	}

	@Override
	public PostDto updatePost(PostDto postdto, int id) {
		Post post = pRepo.findById(id)
				.orElseThrow(()-> new ResourceNotFoundException("Post", "id", id));

		String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		User currentUser = userRepo.findByEmail(currentEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email : " + currentEmail, 0));

		if (post.getUser().getId() != currentUser.getId()) {
			throw new ApiException("You are not authorized to update this post");
		}

		post.setTitle(postdto.getTitle());
		post.setContent(postdto.getContent());

		Post pr = pRepo.save(post);
		return this.PostToDto(pr);
	}

	@Override
	public PostDto getByIdPost(int id) {
		Post post = pRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Post","id",id));
		return this.PostToDto(post);
	}

	@Override
	public PostResponse getAllPost(Integer pageNumber, Integer pageSize, String sortBy, String sortDir) {
		Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

		Pageable p = PageRequest.of(pageNumber, pageSize, sort);

		Page<Post> pagePost = this.pRepo.findAll(p);

		List<Post> allPosts = pagePost.getContent();

		List<PostDto> postDtos = allPosts.stream().map(this::PostToDto).collect(Collectors.toList());

		PostResponse postResponse = new PostResponse();
		postResponse.setContent(postDtos);
		postResponse.setPageNumber(pagePost.getNumber());
		postResponse.setPageSize(pagePost.getSize());
		postResponse.setTotalElements(pagePost.getTotalElements());
		postResponse.setTotalPages(pagePost.getTotalPages());
		postResponse.setLastPage(pagePost.isLast());

		return postResponse;
	}

	@Override
	public void delete(int id) {
		Post post = pRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

		String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

		User currentUser = userRepo.findByEmail(currentEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email : " + currentEmail, 0));

		boolean isOwner = currentUser.getId() == post.getUser().getId();
		boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

		if (!isOwner && !isAdmin) {
			throw new ApiException("You are not authorized to delete this post");
		}

		this.pRepo.delete(post);
	}

	@Override
	public List<PostDto> getPostByCategory(int id) {
		Category ct = categoryRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category", "id", id));
		List<Post> catePosts = pRepo.findByCategory(ct);
		return catePosts.stream().map(this::PostToDto).collect(Collectors.toList());
	}

	@Override
	public PostResponse getPostByUser(int userId, Integer pageNumber, Integer pageSize) {
		User user = userRepo.findById(userId)
				.orElseThrow(()-> new ResourceNotFoundException("User", "id", userId));

		Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("postId").descending());

		Page<Post> pagePost = pRepo.findByUser(user, pageable);

		List<PostDto> postDtos = pagePost.getContent().stream()
				.map(this::PostToDto)
				.toList();

		PostResponse postResponse = new PostResponse();
		postResponse.setContent(postDtos);
		postResponse.setPageNumber(pagePost.getNumber());
		postResponse.setPageSize(pagePost.getSize());
		postResponse.setTotalElements(pagePost.getTotalElements());
		postResponse.setTotalPages(pagePost.getTotalPages());
		postResponse.setLastPage(pagePost.isLast());

		return postResponse;
	}

	public Post DtoToPost(PostDto pd) {
		return this.model.map(pd, Post.class);
	}

	public PostDto PostToDto(Post post) {
		PostDto postDto = model.map(post, PostDto.class);

		if (post.getLikes() != null) {
			long validLikeCount = post.getLikes().stream()
					.filter(like -> !like.getUser().isDeleted())
					.count();
			postDto.setLikeCount((int) validLikeCount);
		} else {
			postDto.setLikeCount(0);
		}

		if (post.getComments() != null) {
			Set<CommentDto> validComments = post.getComments().stream()
					.filter(comment -> !comment.getUser().isDeleted())
					.map(comment -> model.map(comment, CommentDto.class))
					.collect(Collectors.toSet());

			postDto.setComments(validComments);
		}
		return postDto;
	}
}