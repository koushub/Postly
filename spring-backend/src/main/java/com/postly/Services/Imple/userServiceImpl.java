package com.postly.Services.Imple;

import java.util.List;
import java.util.stream.Collectors;

import com.postly.Entities.Role;
import com.postly.Payload.AuthorDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.postly.BlogServices.UserServices;
import com.postly.Entities.User;
import com.postly.Exception.ResourceNotFoundException;
import com.postly.Payload.UserDto;
import com.postly.Repository.UserRepo;

@RequiredArgsConstructor
@Service
public class userServiceImpl implements UserServices {

	private final UserRepo userRepo;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public UserDto createUser(UserDto userDto) {
		if (userRepo.existsByEmail(userDto.getEmail())) {
			throw new com.postly.Exception.ApiException("Email already exists!");
		}
		if (userRepo.existsByName(userDto.getName())) {
			throw new com.postly.Exception.ApiException("Username already taken!");
		}
		User user = DtoToUser(userDto);
		if (user.getRole() == null) {
			user.setRole(Role.USER);
		}
		user.setPassword(this.passwordEncoder.encode(user.getPassword()));
		user.setRole(Role.USER);
		User saveUser = userRepo.save(user);
		return this.userToDto(saveUser);
	}

	@Override
	public UserDto updateuser(UserDto userDto, Integer userId) {
		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

		String currentEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		if (!user.getEmail().equals(currentEmail)) {
			throw new com.postly.Exception.ApiException("You can only update your own profile");
		}

		user.setName(userDto.getName());

		if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
			user.setPassword(this.passwordEncoder.encode(userDto.getPassword()));
		}

		user.setAbout(userDto.getAbout());

		User user1 = userRepo.save(user);
		return userToDto(user1);
	}

	@Override
	public UserDto getUserById(int userId) {
		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
		return this.userToDto(user);
	}

	@Override
	public List<UserDto> getAlluser() {
		List<User> users = userRepo.findByIsDeletedFalse();
		return users.stream().map(this::userToDto).collect(Collectors.toList());
	}

	@Override
	public void deleteUser(int userId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "Id", userId));

		String currentEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		User currentUser = userRepo.findByEmail(currentEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", 0));

		boolean isSelf = currentUser.getId() == userId;
		boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

		if (!isSelf && !isAdmin) {
			throw new com.postly.Exception.ApiException("You are not authorized to delete this user");
		}

		user.setDeleted(true);
		userRepo.save(user);
	}

	@Override
	public AuthorDto getAuthorProfile(int userId) {
		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

		AuthorDto author = new AuthorDto();
		author.setId(user.getId());
		author.setName(user.getName());
		author.setAbout(user.getAbout());

		return author;
	}

	@Override
	public void restoreUser(int userId) {
		User user = userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "Id", userId));

		String currentEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		User currentUser = userRepo.findByEmail(currentEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email", 0));

		if (!currentUser.getRole().name().equals("ADMIN")) {
			throw new com.postly.Exception.ApiException("Only Admins can restore users");
		}

		user.setDeleted(false);
		userRepo.save(user);
	}

	@Override
	public List<UserDto> getBannedUsers() {
		List<User> bannedUsers = userRepo.findByIsDeletedTrue();
		return bannedUsers.stream().map(this::userToDto).collect(Collectors.toList());
	}

	public User DtoToUser(UserDto userdto) {
		return this.modelMapper.map(userdto, User.class);
	}

	public UserDto userToDto(User user) {
		return this.modelMapper.map(user, UserDto.class);
	}
}