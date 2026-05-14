package com.xiaobantian.config;

import com.xiaobantian.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String method = request.getMethod();

        boolean skip =
                "OPTIONS".equalsIgnoreCase(method)
                || uri.startsWith("/swagger-ui/")
                || uri.startsWith("/v3/api-docs")
                || uri.startsWith("/api/auth/")
                || (uri.startsWith("/api/routes/") && "GET".equalsIgnoreCase(method))
                || ((uri.equals("/api/places") || uri.startsWith("/api/places/")) && "GET".equalsIgnoreCase(method))
                || uri.startsWith("/api/weather/")
                || (uri.equals("/api/knowledge/search") && "GET".equalsIgnoreCase(method))
                || (uri.equals("/api/knowledge/documents") && "GET".equalsIgnoreCase(method))
                || uri.startsWith("/api/bookings/")
                || uri.startsWith("/api/chat")
                || uri.startsWith("/api/recommend")
                || uri.startsWith("/api/sound-flowers")
                || uri.equals("/error");

        log.info("[JWT] shouldNotFilter uri={}, method={}, skip={}", uri, method, skip);
        return skip;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String method = request.getMethod();
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        log.info("[JWT] doFilterInternal start uri={}, method={}", uri, method);
        log.info("[JWT] Authorization header exists={}", authHeader != null);

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            log.warn("[JWT] Missing or invalid Authorization header. uri={}", uri);
            filterChain.doFilter(request, response);
            log.info("[JWT] doFilterInternal end uri={}, responseStatus={}", uri, response.getStatus());
            return;
        }

        String token = authHeader.substring(BEARER_PREFIX.length());
        log.info("[JWT] Token extracted. length={}", token.length());

        try {
            boolean tokenValid = jwtService.isTokenValid(token);
            log.info("[JWT] tokenValid={}", tokenValid);

            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                log.info("[JWT] SecurityContext already has authentication: {}",
                        SecurityContextHolder.getContext().getAuthentication().getName());
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null && tokenValid) {
                String username = jwtService.extractUsername(token);
                String role = jwtService.extractRole(token);

                log.info("[JWT] extracted username={}", username);
                log.info("[JWT] extracted role={}", role);

                if (username != null && role != null && !role.isBlank()) {
                    List<SimpleGrantedAuthority> authorities =
                            List.of(new SimpleGrantedAuthority(role));

                    log.info("[JWT] authorities={}", authorities);

                    User principal = new User(username, "", authorities);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(principal, null, authorities);

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    log.info("[JWT] SecurityContext authenticated user={}, authorities={}",
                            username, authorities);
                } else {
                    log.warn("[JWT] username or role invalid. username={}, role={}", username, role);
                }
            } else if (!tokenValid) {
                log.warn("[JWT] Token invalid or expired. uri={}", uri);
            }
        } catch (Exception e) {
            log.error("[JWT] Exception while processing token. uri={}, message={}", uri, e.getMessage(), e);
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);

        log.info("[JWT] doFilterInternal end uri={}, responseStatus={}, authenticatedUser={}",
                uri,
                response.getStatus(),
                SecurityContextHolder.getContext().getAuthentication() != null
                        ? SecurityContextHolder.getContext().getAuthentication().getName()
                        : "null");
    }
}