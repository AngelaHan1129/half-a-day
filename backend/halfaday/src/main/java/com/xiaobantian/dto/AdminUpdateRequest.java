package com.xiaobantian.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminUpdateRequest {

    @Size(max = 100)
    private String displayName;

    @Email
    private String email;

    @Size(min = 8, max = 100)
    private String password;

    private Boolean enabled;
}