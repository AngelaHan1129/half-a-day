package com.xiaobantian.seed;

import com.xiaobantian.model.AdminUser;
import com.xiaobantian.model.Role;
import com.xiaobantian.model.RoleType;
import com.xiaobantian.repository.AdminUserRepository;
import com.xiaobantian.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class AdminDataInitializer implements CommandLineRunner {

    private final AdminUserRepository adminUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role adminRole = roleRepository.findByName(RoleType.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(
                        Role.builder().name(RoleType.ROLE_ADMIN).build()
                ));

        if (!adminUserRepository.existsByUsername("admin")) {
            AdminUser admin = AdminUser.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Admin123!"))
                    .email("admin@xiaobantian.com")
                    .displayName("系統管理員")
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .roles(Set.of(adminRole))
                    .build();

            adminUserRepository.save(admin);
        }
    }
}