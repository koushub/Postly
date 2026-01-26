package com.Blog_Application.Security;

import java.util.Arrays;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Replaces explicit HttpMethod checks in chain with annotation support if needed
public class SecurityConfig {

    private final CustomJwtVerificationFilter jwtFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public Endpoints
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS).permitAll()
                        .requestMatchers("/home/api/auth/login", "/home/api/USER").permitAll()

                        // Public GET endpoints
                        // ALLOW Public View of Author Profile
                        .requestMatchers(HttpMethod.GET, "/home/api/public/users/**").permitAll()
                        // ALLOW Public View of User's Posts (Important!)
                        .requestMatchers(HttpMethod.GET, "/home/api/user/{userId}/POST").permitAll()
                        // Add the base path "/home/api/Category" explicitly
                        .requestMatchers(HttpMethod.GET,
                                "/home/api/Category",       // Allow the list
                                "/home/api/Category/**",    // Allow specific IDs
                                "/home/api/POST/**"
                        ).permitAll()

                        // 3. ADMIN ONLY: Manage Categories (Create, Update, Delete)
                        .requestMatchers(HttpMethod.POST, "/home/api/Category/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/home/api/Category/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/home/api/Category/**").hasRole("ADMIN")
                        // Admin Dashboard
                        .requestMatchers("/home/api/dashboard/**").hasRole("ADMIN")
                        // Admin can see all comments on platform
                        .requestMatchers(HttpMethod.GET, "/home/api/comments/all").hasRole("ADMIN")
                        // Admin Only: View and Dismiss Reports
                        .requestMatchers(HttpMethod.GET, "/home/api/reports").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/home/api/report/**").hasRole("ADMIN")

                        // Authenticated Users: Create Report
                        .requestMatchers(HttpMethod.POST, "/home/api/report").authenticated()

                        // Both User and Admin can delete posts
                        .requestMatchers(HttpMethod.DELETE, "/home/api/**").authenticated()

                        // 4. Authenticated Actions (Delete, Save, Like, Comment, Edit Profile)
                        .requestMatchers(HttpMethod.DELETE, "/home/api/**").authenticated()
                        // All other requests authenticated
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Kept your existing CORS config as it is good for React frontend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(false);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}