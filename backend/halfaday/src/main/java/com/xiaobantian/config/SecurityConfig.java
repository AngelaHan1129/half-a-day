// ============================================================
// src/main/java/com/xiaobantian/config/SecurityConfig.java
// 最終合併版：保留所有原有路徑 + 補入 AR 辨識路徑
// ============================================================
package com.xiaobantian.config;

import com.xiaobantian.service.AdminUserDetailsService;
import jakarta.servlet.DispatcherType;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final AdminUserDetailsService adminUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * 從 application.properties 讀取，逗號分隔
     * app.cors.allowed-origins=http://localhost:5173,http://127.0.0.1:5173,...
     */
    @Value("${app.cors.allowed-origins:" +
           "http://localhost:5173," +
           "http://127.0.0.1:5173," +
           "http://192.168.0.105:5173}")
    private String allowedOrigins;

    // ════════════════════════════════════════════════════════════
    // Security Filter Chain
    // ════════════════════════════════════════════════════════════
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())

            // Boot 3 / Spring Security 6 推薦寫法
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth

                // ── 放行錯誤轉送 / preflight ─────────────────────
                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/error").permitAll()

                // ── Swagger / OpenAPI ──────────────────────────
                .requestMatchers(
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/v3/api-docs.yaml"
                ).permitAll()

                // ── 認證 ──────────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/admins").permitAll()

                // ── 公開 GET ───────────────────────────────────
                .requestMatchers(HttpMethod.GET, "/api/routes/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/places/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/weather/**").permitAll()

                // ── 知識庫 ─────────────────────────────────────
                .requestMatchers(HttpMethod.GET, "/api/knowledge").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/knowledge/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/knowledge").permitAll()

                // ── 預訂 ───────────────────────────────────────
                .requestMatchers(HttpMethod.GET, "/api/bookings/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/bookings").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/bookings/*/confirm").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/bookings/*/cancel").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/bookings/*/complete").permitAll()

                // ── AI 聊天 / 推薦 ─────────────────────────────
                .requestMatchers(HttpMethod.POST, "/api/chat").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/chat/stream").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/recommend").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/recommend/stream").permitAll()

                // ── 聲音花 ─────────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/api/sound-flowers").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/sound-flowers/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/sound-flowers/**").hasRole("ADMIN")

                // ── 景點 CRUD ──────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/api/places").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/places/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/places/**").hasRole("ADMIN")

                // ── AR 辨識知識 API（公開）────────────────────
                .requestMatchers(HttpMethod.POST, "/api/detection/resolve").permitAll()

                // ── Admin 後台 ─────────────────────────────────
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // ── 其餘需要登入 ───────────────────────────────
                .anyRequest().authenticated()
            )

            .authenticationProvider(authenticationProvider())
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // ════════════════════════════════════════════════════════════
    // CORS（讀取 application.properties）
    // ════════════════════════════════════════════════════════════
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
            .map(String::trim)
            .filter(s -> !s.isBlank())
            .toList();

        config.setAllowedOrigins(origins);
        config.setAllowedMethods(
            List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ════════════════════════════════════════════════════════════
    // Authentication / Password
    // ════════════════════════════════════════════════════════════
    @Bean
    public AuthenticationManager authenticationManager(
        AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(adminUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}