package com.xiaobantian.controller;

import com.xiaobantian.dto.RecommendRequest;
import com.xiaobantian.service.RecommendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
@Tag(name = "Recommend Controller", description = "AI 行程推薦與即時串流推薦相關 API")
public class RecommendController {

    private final RecommendService recommendService;

    @Operation(
            summary = "一般推薦",
            description = "根據使用者輸入條件產生完整旅遊推薦結果，適合一般同步請求使用。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得推薦結果",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(type = "string", example = "推薦您安排小半天高架橋、石馬公園與德興瀑布的一日遊行程。")
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求格式錯誤或欄位缺漏", content = @Content),
            @ApiResponse(responseCode = "500", description = "推薦服務處理失敗", content = @Content)
    })
    @PostMapping
    public String recommend(
            @RequestBody(
                    description = "推薦請求資料，包含使用者偏好、旅遊條件或問題內容",
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody RecommendRequest req) {
        return recommendService.recommend(req);
    }

    @Operation(
            summary = "串流推薦",
            description = "以 Server-Sent Events (SSE) 方式逐步串流回傳推薦內容，適合前端即時顯示 AI 生成結果。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功建立串流推薦回應",
                    content = @Content(
                            mediaType = "text/event-stream",
                            schema = @Schema(type = "string", example = "推薦您先到孟宗竹林古戰場，再安排大崙山觀光茶園。")
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求格式錯誤或欄位缺漏", content = @Content),
            @ApiResponse(responseCode = "500", description = "推薦串流服務處理失敗", content = @Content)
    })
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> recommendStream(
            @RequestBody(
                    description = "串流推薦請求資料，包含使用者偏好、旅遊條件或問題內容",
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody RecommendRequest req) {
        return recommendService.recommendStream(req);
    }
}