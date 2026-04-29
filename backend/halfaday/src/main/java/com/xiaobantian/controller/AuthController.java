package com.xiaobantian.controller;

import com.xiaobantian.dto.AdminCreateRequest;
import com.xiaobantian.dto.AdminUpdateRequest;
import com.xiaobantian.dto.LoginRequest;
import com.xiaobantian.dto.LoginResponse;
import com.xiaobantian.model.AdminUser;
import com.xiaobantian.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth Controller", description = "登入驗證與管理者帳號維護相關 API")
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "管理者登入",
            description = "使用管理者帳號與密碼進行登入，成功後回傳登入結果與角色資訊。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "登入成功",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求格式錯誤或欄位驗證失敗", content = @Content),
            @ApiResponse(responseCode = "401", description = "帳號或密碼錯誤", content = @Content)
    })
    @PostMapping("/login")
    public LoginResponse login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "登入請求資料，需提供帳號與密碼",
                    required = true
            )
            @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }

    @Operation(
            summary = "建立管理者帳號",
            description = "新增一筆管理者帳號資料，包含帳號、密碼、Email 與顯示名稱。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功建立管理者帳號",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AdminUser.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求格式錯誤或欄位驗證失敗", content = @Content),
            @ApiResponse(responseCode = "409", description = "帳號或 Email 已存在", content = @Content)
    })
    @PostMapping("/admins")
    public AdminUser createAdmin(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "建立管理者帳號所需資料",
                    required = true
            )
            @Valid @RequestBody AdminCreateRequest request
    ) {
        return authService.createAdmin(request);
    }

    @Operation(
            summary = "更新管理者帳號",
            description = "依照管理者 ID 更新顯示名稱、Email、密碼或啟用狀態。"
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功更新管理者帳號",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = AdminUser.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求格式錯誤或欄位驗證失敗", content = @Content),
            @ApiResponse(responseCode = "401", description = "尚未登入或 Token 無效", content = @Content),
            @ApiResponse(responseCode = "403", description = "權限不足", content = @Content),
            @ApiResponse(responseCode = "404", description = "找不到指定管理者帳號", content = @Content)
    })
    @PutMapping("/admins/{id}")
    public AdminUser updateAdmin(
            @Parameter(description = "要更新的管理者帳號 ID", required = true, example = "1")
            @PathVariable Long id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "管理者更新資料，可部分欄位更新",
                    required = true
            )
            @Valid @RequestBody AdminUpdateRequest request
    ) {
        return authService.updateAdmin(id, request);
    }
}