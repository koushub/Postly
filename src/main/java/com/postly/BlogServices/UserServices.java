package com.postly.BlogServices;

import java.util.List;

import com.postly.Payload.AuthorDto;
import com.postly.Payload.UserDto;

public interface UserServices {

	UserDto createUser(UserDto user);
	UserDto updateuser(UserDto user,Integer userId);
	UserDto getUserById(int userId);
	List<UserDto> getAlluser();
	void deleteUser(int userId);
	AuthorDto getAuthorProfile(int userId);
	void restoreUser(int userId);
	List<UserDto> getBannedUsers();
}
