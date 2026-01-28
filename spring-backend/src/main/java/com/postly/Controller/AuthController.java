package com.postly.Controller;

import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.postly.Entities.User;
import com.postly.Payload.JwtAuthRequest;
import com.postly.Payload.JwtAuthResponse;
import com.postly.Payload.UserDto;
import com.postly.Repository.UserRepo;
import com.postly.Security.JwtUtils;
import com.postly.Security.UserPrincipal;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/home/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final ModelMapper modelMapper;
    private final UserRepo userRepo;

    @PostMapping("/login")
    public ResponseEntity<JwtAuthResponse> createToken(@RequestBody JwtAuthRequest request) throws Exception {

        Authentication authentication;
        try {
            authentication = this.authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Invalid username or password", e);
        }

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        String token = this.jwtUtils.generateToken(principal);

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        JwtAuthResponse response = new JwtAuthResponse();
        response.setToken(token);
        response.setUser(modelMapper.map(user, UserDto.class));

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}