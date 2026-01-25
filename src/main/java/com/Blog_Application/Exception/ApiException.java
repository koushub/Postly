package com.Blog_Application.Exception;

public class ApiException extends RuntimeException {
    public ApiException(String message) {
        super(message);
    }
}