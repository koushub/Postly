package com.postly.Security;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.postly.Entities.User;
import com.postly.Repository.UserRepo;
import com.postly.Exception.ResourceNotFoundException;

@RequiredArgsConstructor
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = this.userRepo.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("User ", "email: " + email, 0));
        // Create UserPrincipal based on your User entity
        // Note: Adding "ROLE_" prefix to match standard Spring Security expectations if your Enum is just "ADMIN"
        String roleName = "ROLE_" + user.getRole().name();

        return new UserPrincipal(
                String.valueOf(user.getId()),
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(roleName)),
                roleName
        );
    }
}