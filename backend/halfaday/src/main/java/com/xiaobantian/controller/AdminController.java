package com.xiaobantian.controller;

import com.xiaobantian.model.AdminUser;
import com.xiaobantian.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Controller", description = "管理者帳號管理相關 API，需具備 ADMIN 權限")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminUserService adminUserService;

    @Operation(
            summary = "取得所有管理者",
            description = "查詢系統內所有管理者帳號資料，僅限具備 ADMIN 權限的使用者呼叫。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得管理者清單",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AdminUser.class))
            ),
            @ApiResponse(responseCode = "401", description = "尚未登入或 Token 無效", content = @Content),
            @ApiResponse(responseCode = "403", description = "權限不足，需具備 ADMIN 身分", content = @Content)
    })
    @GetMapping("/users")
    public List<AdminUser> findAllAdmins() {
        return adminUserService.findAll();
    }

    @Operation(
            summary = "啟用管理者帳號",
            description = "依照管理者 ID 啟用指定帳號，被啟用的帳號可重新登入後台。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功啟用管理者帳號",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AdminUser.class))
            ),
            @ApiResponse(responseCode = "400", description = "請求參數錯誤", content = @Content),
            @ApiResponse(responseCode = "401", description = "尚未登入或 Token 無效", content = @Content),
            @ApiResponse(responseCode = "403", description = "權限不足，需具備 ADMIN 身分", content = @Content),
            @ApiResponse(responseCode = "404", description = "找不到指定管理者帳號", content = @Content)
    })
    @PatchMapping("/users/{id}/enable")
    public AdminUser enable(
            @Parameter(description = "管理者帳號 ID", required = true, example = "1")
            @PathVariable Long id
    ) {
        return adminUserService.enable(id);
    }

    @Operation(
            summary = "停用管理者帳號",
            description = "依照管理者 ID 停用指定帳號，被停用的帳號將無法登入後台。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功停用管理者帳號",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AdminUser.class))
            ),
            @ApiResponse(responseCode = "400", description = "請求參數錯誤", content = @Content),
            @ApiResponse(responseCode = "401", description = "尚未登入或 Token 無效", content = @Content),
            @ApiResponse(responseCode = "403", description = "權限不足，需具備 ADMIN 身分", content = @Content),
            @ApiResponse(responseCode = "404", description = "找不到指定管理者帳號", content = @Content)
    })
    @PatchMapping("/users/{id}/disable")
    public AdminUser disable(
            @Parameter(description = "管理者帳號 ID", required = true, example = "1")
            @PathVariable Long id
    ) {
        return adminUserService.disable(id);
    }
}