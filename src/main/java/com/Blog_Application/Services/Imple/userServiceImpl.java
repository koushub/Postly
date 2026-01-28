package com.Blog_Application.Services.Imple;

import java.util.List;
import java.util.stream.Collectors;

import com.Blog_Application.Entities.Role;
import com.Blog_Application.Payload.AuthorDto;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Blog_Application.BlogServices.UserServices;
import com.Blog_Application.Entities.User;
import com.Blog_Application.Exception.ResourceNotFoundException;
import com.Blog_Application.Payload.UserDto;
import com.Blog_Application.Repository.UserRepo;

@RequiredArgsConstructor
@Service
public class userServiceImpl implements UserServices {

	private final UserRepo userRepo;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;

	@Override
	public UserDto createUser(UserDto userDto) {
		// Check for Duplicate Email
		if (userRepo.existsByEmail(userDto.getEmail())) {
			throw new com.Blog_Application.Exception.ApiException("Email already exists!");
		}
		// Check for Duplicate Username
		if (userRepo.existsByName(userDto.getName())) {
			throw new com.Blog_Application.Exception.ApiException("Username already taken!");
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

		// --- SECURITY CHECK START ---
		String currentEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		// Check if the logged-in user's email matches the account they are trying to update
		if (!user.getEmail().equals(currentEmail)) {
			throw new com.Blog_Application.Exception.ApiException("You can only update your own profile");
		}
		// --- SECURITY CHECK END ---

		user.setName(userDto.getName());
		// user.setEmail(userDto.getEmail()); // Careful allowing email updates (might need re-verification)

		// user.setEmail(userDto.getEmail()); // Careful allowing email updates

		// --- REPLACE THE OLD PASSWORD LINE WITH THIS BLOCK ---
		// Only update password if the user actually sent a new one (not null, not empty)
		if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
			user.setPassword(this.passwordEncoder.encode(userDto.getPassword()));
		}
		// ---------------------------------------------------

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

		// --- SECURITY CHECK START ---
		String currentEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		User currentUser = userRepo.findByEmail(currentEmail).orElseThrow(() -> new ResourceNotFoundException("User", "email", 0));

		boolean isSelf = currentUser.getId() == userId;
		boolean isAdmin = currentUser.getRole().name().equals("ADMIN");

		if (!isSelf && !isAdmin) {
			throw new com.Blog_Application.Exception.ApiException("You are not authorized to delete this user");
		}
		// --- SECURITY CHECK END ---

		// Soft Delete
		user.setDeleted(true);
		userRepo.save(user);
	}

	@Override
	public AuthorDto getAuthorProfile(int userId) {
		User user = this.userRepo.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

		// Manual mapping or use ModelMapper if you configured it for this
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

		// --- SECURITY CHECK START ---
		String currentEmail = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
		User currentUser = userRepo.findByEmail(currentEmail)
				.orElseThrow(() -> new ResourceNotFoundException("User", "email", 0));

		if (!currentUser.getRole().name().equals("ADMIN")) {
			throw new com.Blog_Application.Exception.ApiException("Only Admins can restore users");
		}
		// --- SECURITY CHECK END ---

		// Restore the user
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