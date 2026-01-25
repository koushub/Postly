package com.Blog_Application.Security;

import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtils {

    // You can move these to application.properties like the Healthcare app
    private long jwtExpirationTime = 5 * 60 * 60 * 1000; // 5 hours in ms
    private String jwtSecret = "my-very-long-and-secure-secret-key-for-jwt-authentication-must-be-at-least-256-bits";

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Generate JWT with custom claims (user_id, user_role)
    public String generateToken(UserPrincipal principal) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + jwtExpirationTime);

        return Jwts.builder()
                .subject(principal.getEmail())
                .issuedAt(now)
                .expiration(expiresAt)
                .claims(Map.of(
                        "user_id", principal.getUserId(),
                        "user_role", principal.getUserRole()
                ))
                .signWith(secretKey)
                .compact();
    }

    // Validate and return Claims
    public Claims validateToken(String jwt) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(jwt)
                .getPayload();
    }
}