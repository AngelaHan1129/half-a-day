package com.xiaobantian.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException ex
    ) throws IOException, ServletException {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        log.error("[403] Access denied. method={}, uri={}, query={}, user={}, message={}",
                request.getMethod(),
                request.getRequestURI(),
                request.getQueryString(),
                auth != null ? auth.getName() : "anonymous",
                ex.getMessage(),
                ex);

        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("""
            {
              "error":"access_denied",
              "message":"Forbidden",
              "path":"%s"
            }
            """.formatted(request.getRequestURI()));
    }
}