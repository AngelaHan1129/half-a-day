package com.xiaobantian.config;

import com.xiaobantian.security.JwtService;
import com.xiaobantian.service.AdminUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final AdminUserDetailsService adminUserDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        boolean isGet = "GET".equalsIgnoreCase(method);
        boolean isPost = "POST".equalsIgnoreCase(method);
        boolean isPut = "PUT".equalsIgnoreCase(method);
        boolean isOptions = "OPTIONS".equalsIgnoreCase(method);

        boolean skip =
            isOptions ||
            "/error".equals(uri) ||
            ("/api/auth/login".equals(uri) && isPost) ||
            ("/api/auth/admins".equals(uri) && isPost) ||
            uri.startsWith("/swagger-ui") ||
            uri.startsWith("/v3/api-docs") ||
            (uri.startsWith("/api/routes") && isGet) ||
            (uri.startsWith("/api/places") && isGet) ||
            (uri.startsWith("/api/weather") && isGet) ||
            ("/api/knowledge".equals(uri) && isGet) ||
            (uri.startsWith("/api/knowledge/") && isGet) ||
            ("/api/knowledge".equals(uri) && isPost) ||
            (uri.startsWith("/api/bookings") && (isGet || isPost || isPut)) ||
            ("/api/chat".equals(uri) && isPost) ||
            ("/api/chat/stream".equals(uri) && isGet) ||
            ("/api/recommend".equals(uri) && isPost) ||
            ("/api/recommend/stream".equals(uri) && isPost) ||
            ("/api/sound-flowers".equals(uri) && isPost) ||
            ("/api/detection/resolve".equals(uri) && isPost);

        log.info("[JWT] shouldNotFilter uri={}, method={}, skip={}", uri, method, skip);
        return skip;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        log.info("[JWT] doFilterInternal uri={}, method={}, authHeaderPresent={}",
                request.getRequestURI(), request.getMethod(), authHeader != null);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String jwt = authHeader.substring(7);
            String username = jwtService.extractUsername(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                var userDetails = adminUserDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                    var authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            log.error("[JWT] token parse failed: {}", e.getMessage(), e);
        }

        filterChain.doFilter(request, response);
    }
}