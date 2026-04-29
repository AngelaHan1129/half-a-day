package com.xiaobantian.repository;

import com.xiaobantian.model.Role;
import com.xiaobantian.model.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleType name);
}