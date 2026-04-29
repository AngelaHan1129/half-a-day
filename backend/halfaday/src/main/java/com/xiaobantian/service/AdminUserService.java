package com.xiaobantian.service;

import com.xiaobantian.model.AdminUser;
import com.xiaobantian.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;

    public List<AdminUser> findAll() {
        return adminUserRepository.findAll();
    }

    public AdminUser enable(Long id) {
        AdminUser user = adminUserRepository.findById(id).orElseThrow();
        user.setEnabled(true);
        return adminUserRepository.save(user);
    }

    public AdminUser disable(Long id) {
        AdminUser user = adminUserRepository.findById(id).orElseThrow();
        user.setEnabled(false);
        return adminUserRepository.save(user);
    }
}