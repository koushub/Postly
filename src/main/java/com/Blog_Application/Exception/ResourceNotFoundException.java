package com.Blog_Application.Exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceNotFoundException extends RuntimeException {
	
	String resource;
	String fieldName;
	int fieldValue;
	
	public ResourceNotFoundException(String resource,String fieldName,int fieldValue) {
		super(String.format("%s not found  with  %s : %d",resource,fieldName,fieldValue));
		this.resource = resource;
		this.fieldName = fieldName;
		this.fieldValue = fieldValue;
	}

	public ResourceNotFoundException(String resource, String fieldName, Integer userId) {
	    super(String.format("%s not found with %s : %d", resource, fieldName, userId));
	    this.resource = resource;
	    this.fieldName = fieldName;
	    this.fieldValue = userId;
	}

//	public ResourceNotFoundException(String resource, String fieldName, String fieldValue) {
//		super(String.format("%s not found with %s : %s", resource, fieldName, fieldValue));
//		this.resource = resource;
//		this.fieldName = fieldName;
//		this.fieldValue = 0; // Default to 0 since field is int
//	}
}

