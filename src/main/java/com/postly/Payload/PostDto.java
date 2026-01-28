package com.postly.Payload;


import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

    private int postId;

	@NotEmpty(message = "Title cannot be empty")
	private String title;

	@NotEmpty(message = "Content cannot be empty")
	private String content;

	private String imageName;
	private Date uploadDate;
	private CategoryDto category;
	private UserDto user;
	private Set<CommentDto> comments = new HashSet<>();
	private int likeCount;
}
