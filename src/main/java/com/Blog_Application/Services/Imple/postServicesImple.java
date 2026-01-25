package com.Blog_Application.Services.Imple;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.Blog_Application.Payload.PostResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.Blog_Application.BlogServices.postServices;
import com.Blog_Application.Entities.Category;
import com.Blog_Application.Entities.Post;
import com.Blog_Application.Entities.User;
import com.Blog_Application.Exception.ResourceNotFoundException;
import com.Blog_Application.Payload.PostDto;
import com.Blog_Application.Repository.UserRepo;
import com.Blog_Application.Repository.CategoryRepo;
import com.Blog_Application.Repository.PostRepo;
import org.springframework.security.core.context.SecurityContextHolder;
import com.Blog_Application.Exception.ApiException;

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
		post.setImageName("default.png");
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

		// --- SECURITY CHECK START ---
		String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
		User currentUser = userRepo.findByEmail(currentEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email : " + currentEmail, 0));

		if (post.getUser().getId() != currentUser.getId()) {
			throw new ApiException("You are not authorized to update this post");
		}
		// --- SECURITY CHECK END ---

		post.setTitle(postdto.getTitle());
		post.setContent(postdto.getContent());

		// Optional: Update category if provided in DTO
		// if(postdto.getCategory() != null) ...

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
		// 1. Determine Sort Direction
		Sort sort = (sortDir.equalsIgnoreCase("asc")) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

		// 2. Create Pageable Object
		Pageable p = PageRequest.of(pageNumber, pageSize, sort);

		// 3. Fetch Page from DB
		Page<Post> pagePost = this.pRepo.findAll(p);

		// 4. Get Content from Page
		List<Post> allPosts = pagePost.getContent();

		// 5. Convert to DTOs
		List<PostDto> postDtos = allPosts.stream().map(this::PostToDto).collect(Collectors.toList());

		// 6. Construct Response
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
		// 1. Find Post
		Post post = pRepo.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Post", "id", id));

		// 2. Get Current User Email
		String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();

		// 3. Find User
		// Note: We pass '0' because ResourceNotFoundException expects an int/Integer value,
		// but we are searching by String (email).
		User currentUser = userRepo.findByEmail(currentEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email : " + currentEmail, 0));

		// 4. Check: Is Owner OR Is Admin?
		boolean isOwner = currentUser.getId() == post.getUser().getId();
		boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

		if (!isOwner && !isAdmin) {
			// Use ApiException because ResourceNotFoundException cannot take just a String message
			throw new ApiException("You are not authorized to delete this post");
		}

		// 5. Delete
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
		// 1. Fetch User
		User user = userRepo.findById(userId)
				.orElseThrow(()-> new ResourceNotFoundException("User", "id", userId));

		// 2. Create Pageable
		// You can add sorting params here if you want, defaulting to postId desc for now
		Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("postId").descending());

		// 3. Fetch Page
		Page<Post> pagePost = pRepo.findByUser(user, pageable);

		// 4. Convert to DTOs
		List<PostDto> postDtos = pagePost.getContent().stream()
				.map(this::PostToDto)
				.toList();

		// 5. Construct Response
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

		if(post.getLikes() != null){
			postDto.setLikeCount(post.getLikes().size());
		}
		else{
			postDto.setLikeCount(0);
		}
		return postDto;
	}
}