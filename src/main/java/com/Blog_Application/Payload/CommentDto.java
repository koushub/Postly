package com.Blog_Application.Payload;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDto {
	
	private int id;

	@NotEmpty(message = "Title cannot be empty")
	private String content;

}
