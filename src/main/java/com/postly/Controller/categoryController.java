package com.postly.Controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.postly.BlogServices.categoryService;
import com.postly.Payload.CategoryDto;
import com.postly.Payload.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("home/api")
@Tag(name = "Category Controller", description = "APIs for managing blog categories")
public class categoryController {

	private final categoryService cService;

	@PostMapping("Category")
	@Operation(summary = "Create Category", description = "Create a new category")
	public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody CategoryDto cDto) {
		CategoryDto newCategory = this.cService.createCategory(cDto);
		return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
	}

	@PutMapping("Category/{categoryId}")
	@Operation(summary = "Update Category", description = "Update an existing category by ID")
	public ResponseEntity<CategoryDto> updateCategoryInController(@Valid @RequestBody CategoryDto cDto, @PathVariable("categoryId") int id){
		CategoryDto updateDto = this.cService.updateCategory(cDto, id);
		return new ResponseEntity<>(updateDto, HttpStatus.OK);
	}

	@GetMapping("Category/{categoryId}")
	@Operation(summary = "Get Category", description = "Fetch a single category by ID")
	public ResponseEntity<CategoryDto> getSingleCategoryInController(@PathVariable("categoryId") int id){
		CategoryDto category = this.cService.getCategotyById(id);
		return ResponseEntity.status(HttpStatus.OK).body(category);
	}

	@GetMapping("Category")
	@Operation(summary = "Get All Categories", description = "Fetch all available categories")
	public ResponseEntity<List<CategoryDto>> getAllCategoryInController(){
		List<CategoryDto> allDto = this.cService.getAllCategory();
		return ResponseEntity.status(HttpStatus.OK).body(allDto);
	}

	@DeleteMapping("Category/{categoryId}")
	@Operation(summary = "Delete Category", description = "Delete a category by ID")
	public ResponseEntity<ApiResponse> deleteCategoryInController(@PathVariable("categoryId") int id) {
		this.cService.deleteCategory(id);
		return new ResponseEntity<>(new ApiResponse("categories deleted successfully", true), HttpStatus.OK);
	}
}