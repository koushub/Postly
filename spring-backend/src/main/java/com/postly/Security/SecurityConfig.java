package com.postly.Security;

import java.util.Arrays;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
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
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomJwtVerificationFilter jwtFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS).permitAll()
                        .requestMatchers("/home/api/auth/login", "/home/api/USER").permitAll()

                        .requestMatchers(HttpMethod.GET, "/home/api/public/users/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/home/api/user/{userId}/POST").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/home/api/Category",
                                "/home/api/Category/**",
                                "/home/api/POST/**"
                        ).permitAll()

                        .requestMatchers(HttpMethod.POST, "/home/api/Category/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/home/api/Category/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/home/api/Category/**").hasRole("ADMIN")
                        .requestMatchers("/home/api/dashboard/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/home/api/comments/all").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/home/api/reports").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/home/api/report/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/home/api/USER/*/restore").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/home/api/USER/banned").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/home/api/report").authenticated()

                        .requestMatchers(HttpMethod.DELETE, "/home/api/**").authenticated()

                        .requestMatchers(HttpMethod.DELETE, "/home/api/**").authenticated()
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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:3000", "https://postly-frontend.onrender.com"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "X-Requested-With"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(false);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}