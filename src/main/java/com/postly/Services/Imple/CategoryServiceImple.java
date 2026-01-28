package com.postly.Services.Imple;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.postly.BlogServices.categoryService;
import com.postly.Entities.Category;
import com.postly.Exception.ResourceNotFoundException;
import com.postly.Payload.CategoryDto;
import com.postly.Repository.CategoryRepo;

@RequiredArgsConstructor
@Service
public class CategoryServiceImple implements categoryService {

	private final CategoryRepo cate;
	private final ModelMapper model;

	@Override
	public CategoryDto createCategory(CategoryDto categorydto) {
		Category category = DtoTOCategory(categorydto);
		Category savedCategory = cate.save(category);
		return this.categoryTODto(savedCategory);
	}

	@Override
	public CategoryDto updateCategory(CategoryDto categoryDto, int id) {
		Category category = cate.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category", "id", id));
		category.setCategoryTitle(categoryDto.getCategoryTitle());
		category.setCategoryDescription(categoryDto.getCategoryDescription());
		Category category1= cate.save(category);
		return categoryTODto(category1);
	}

	@Override
	public CategoryDto getCategotyById(int id) {
		Category category = this.cate.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category","id",id));
		return this.categoryTODto(category);
	}

	@Override
	public List<CategoryDto> getAllCategory() {
		// Use the new repository method
		List<Category> allCategory = this.cate.findByIsDeletedFalse();
		return allCategory.stream().map(this::categoryTODto).collect(Collectors.toList());
	}

	@Override
	public void deleteCategory(int id) {
		Category category = this.cate.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category","id",id));
		// Soft Delete
		category.setDeleted(true);
		this.cate.save(category);
	}

	public Category DtoTOCategory(CategoryDto catedto) {
		return this.model.map(catedto, Category.class);
	}

	public CategoryDto categoryTODto(Category category) {
		return this.model.map(category, CategoryDto.class);
	}
}