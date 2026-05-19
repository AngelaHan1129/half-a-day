package com.xiaobantian.controller;

import com.xiaobantian.model.Route;
import com.xiaobantian.service.RouteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
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
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@Tag(name = "Route Controller", description = "旅遊路線查詢、搜尋與篩選相關 API")
public class RouteController {

    private final RouteService routeService;

    @Operation(
            summary = "取得全部路線",
            description = "查詢系統內所有旅遊路線資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得路線清單",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Route.class))
                    )
            )
    })
    @GetMapping
    public List<Route> findAll() {
        return routeService.findAll();
    }

    @Operation(
            summary = "取得單一路線",
            description = "依照路線 ID 取得指定旅遊路線的詳細資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得路線資料",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Route.class)
                    )
            ),
            @ApiResponse(responseCode = "404", description = "找不到指定路線", content = @Content)
    })
    @GetMapping("/{id}")
    public Route findById(
            @Parameter(description = "路線 ID", required = true, example = "1")
            @PathVariable("id") Long id
    ) {
        return routeService.findById(id);
    }

    @Operation(
            summary = "關鍵字搜尋路線",
            description = "依照關鍵字搜尋符合條件的旅遊路線資料。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得搜尋結果",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Route.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "查詢參數錯誤", content = @Content)
    })
    @GetMapping("/search")
    public List<Route> search(
            @Parameter(description = "搜尋關鍵字", required = true, example = "一日遊")
            @RequestParam("keyword") String keyword
    ) {
        return routeService.searchByKeyword(keyword);
    }

    @Operation(
            summary = "依最長時數篩選路線",
            description = "依照最大旅遊時數查詢符合條件的旅遊路線。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得符合時數條件的路線清單",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Route.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "maxHours 參數錯誤", content = @Content)
    })
    @GetMapping("/duration")
    public List<Route> findByDuration(
            @Parameter(description = "最大時數", required = true, example = "6")
            @RequestParam("maxHours") Integer maxHours
    ) {
        return routeService.findByMaxHours(maxHours);
    }

    @Operation(
            summary = "依季節篩選路線",
            description = "依照季節查詢適合的旅遊路線，例如 spring、summer、autumn、winter。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得符合季節條件的路線清單",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Route.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "season 參數錯誤", content = @Content)
    })
    @GetMapping("/season/{season}")
    public List<Route> findBySeason(
            @Parameter(description = "季節名稱", required = true, example = "spring")
            @PathVariable("season") String season
    ) {
        return routeService.findBySeason(season);
    }

    @Operation(
            summary = "新增路線",
            description = "新增一筆旅遊路線資料，需具備 ADMIN 權限。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功新增路線",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Route.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求資料錯誤", content = @Content),
            @ApiResponse(responseCode = "401", description = "尚未登入或 Token 無效", content = @Content),
            @ApiResponse(responseCode = "403", description = "權限不足，需具備 ADMIN 身分", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Route create(@RequestBody Route route) {
        return routeService.create(route);
    }

    @Operation(
            summary = "修改路線",
            description = "依照路線 ID 修改旅遊路線資料，需具備 ADMIN 權限。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功修改路線",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Route.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求資料錯誤", content = @Content),
            @ApiResponse(responseCode = "401", description = "尚未登入或 Token 無效", content = @Content),
            @ApiResponse(responseCode = "403", description = "權限不足，需具備 ADMIN 身分", content = @Content),
            @ApiResponse(responseCode = "404", description = "找不到指定路線", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public Route update(
            @Parameter(description = "路線 ID", required = true, example = "1")
            @PathVariable Long id,
            @RequestBody Route route
    ) {
        return routeService.update(id, route);
    }

    @Operation(
            summary = "刪除路線",
            description = "依照路線 ID 刪除旅遊路線資料，需具備 ADMIN 權限。"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "成功刪除路線", content = @Content),
            @ApiResponse(responseCode = "401", description = "尚未登入或 Token 無效", content = @Content),
            @ApiResponse(responseCode = "403", description = "權限不足，需具備 ADMIN 身分", content = @Content),
            @ApiResponse(responseCode = "404", description = "找不到指定路線", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void delete(
            @Parameter(description = "路線 ID", required = true, example = "1")
            @PathVariable Long id
    ) {
        routeService.delete(id);
    }
}