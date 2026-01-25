package com.Blog_Application.Security;

import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Blog_Application.Payload.ApiResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CustomJwtVerificationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final ObjectMapper objectMapper; // Jackson object mapper

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // 1. Check for Authorization header
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwt = authHeader.substring(7);

                // 2. Validate token
                Claims claims = jwtUtils.validateToken(jwt);

                // 3. Extract claims
                String userId = claims.get("user_id", String.class);
                String role = claims.get("user_role", String.class);

                // 4. Create Authentication object (UserPrincipal)
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));

                UserPrincipal principal = new UserPrincipal(
                        userId,
                        claims.getSubject(),
                        null, // password not needed here
                        authorities,
                        role
                );

                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        principal, null, authorities);

                // 5. Store in context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // Handle invalid token exceptions manually (like in Healthcare app)
            SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            ApiResponse resp = new ApiResponse("Invalid Token: " + e.getMessage(), false);
            response.getWriter().write(objectMapper.writeValueAsString(resp));
        }
    }
}