package com.Blog_Application.BlogServices;

import java.util.List;

import com.Blog_Application.Payload.PostDto;
import com.Blog_Application.Payload.PostResponse;

public interface postServices {

	public PostDto createPost(PostDto postdto, int userId, int categoryId);
	
	public PostDto updatePost(PostDto postdto, int id);
	
	public PostDto getByIdPost(int id);
	
	public PostResponse getAllPost(Integer pageNumber, Integer pageSize, String sortBy, String sortDir);
	
	public void delete(int id);
	
	public List<PostDto> getPostByCategory(int id);

	PostResponse getPostByUser(int userId, Integer pageNumber, Integer pageSize);
	
}
