package com.xiaobantian.service;

import com.xiaobantian.dto.AdminCreateRequest;
import com.xiaobantian.dto.AdminUpdateRequest;
import com.xiaobantian.dto.LoginRequest;
import com.xiaobantian.dto.LoginResponse;
import com.xiaobantian.model.AdminUser;
import com.xiaobantian.model.Role;
import com.xiaobantian.model.RoleType;
import com.xiaobantian.repository.AdminUserRepository;
import com.xiaobantian.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AdminUserRepository adminUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        AdminUser user = adminUserRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("找不到管理者帳號"));

        String role = user.getRoles().stream()
                .findFirst()
                .map(r -> r.getName().name())
                .orElse("ROLE_ADMIN");

        String token = jwtService.generateToken(user);
        return new LoginResponse("登入成功", user.getUsername(), role, token);
    }

    public AdminUser createAdmin(AdminCreateRequest request) {
        if (adminUserRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("帳號已存在");
        }

        if (adminUserRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email 已存在");
        }

        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("找不到 ROLE_ADMIN"));

        AdminUser adminUser = AdminUser.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .displayName(request.getDisplayName())
                .enabled(true)
                .createdAt(LocalDateTime.now())
                .roles(Set.of(adminRole))
                .build();

        return adminUserRepository.save(adminUser);
    }

    public AdminUser updateAdmin(Long id, AdminUpdateRequest request) {
        AdminUser adminUser = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("找不到管理者"));

        if (request.getDisplayName() != null && !request.getDisplayName().isBlank()) {
            adminUser.setDisplayName(request.getDisplayName());
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            adminUser.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            adminUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getEnabled() != null) {
            adminUser.setEnabled(request.getEnabled());
        }

        return adminUserRepository.save(adminUser);
    }
}