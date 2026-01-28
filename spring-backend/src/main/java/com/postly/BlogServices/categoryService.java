package com.postly.BlogServices;

import java.util.List;

import com.postly.Payload.CategoryDto;

public interface categoryService {
	
	public CategoryDto createCategory(CategoryDto categorydto);
	public CategoryDto updateCategory(CategoryDto categoryDto ,int id);
	public CategoryDto getCategotyById(int id);
	public List<CategoryDto> getAllCategory();
	public void deleteCategory(int id);

}