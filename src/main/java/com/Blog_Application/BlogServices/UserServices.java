package com.Blog_Application.BlogServices;

import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.Blog_Application.Payload.UserDto;

public interface UserServices {

	UserDto createUser(UserDto user);
	UserDto updateuser(UserDto user,Integer userId);
	UserDto getUserById(int userId);
	List<UserDto> getAlluser();
	void deleteUser(int userId);

}
