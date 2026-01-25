package com.Blog_Application.Payload;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto {

	@Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Unique identifier of the category")
	private int id;

	@NotEmpty
	@Size(max=100, message="Title must be less than 100 characters")
	@Schema(description = "Title of the blog category", example = "Technology")
	private String categoryTitle;

	@NotNull
	@Schema(description = "Detailed description of the category", example = "Posts related to latest tech trends")
	private String categoryDescription;

}