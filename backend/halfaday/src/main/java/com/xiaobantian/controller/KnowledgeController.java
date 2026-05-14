package com.xiaobantian.controller;

import com.xiaobantian.service.KnowledgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/knowledge")
@RequiredArgsConstructor
@Tag(name = "Knowledge Controller", description = "知識庫查詢與新增相關 API")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    @Operation(
            summary = "知識庫語意搜尋",
            description = "依照查詢字串從知識庫中搜尋最相關的內容，回傳 JSON 結果。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得搜尋結果",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "406",
                    description = "僅支援 application/json",
                    content = @Content(mediaType = "application/problem+json")
            ),
            @ApiResponse(responseCode = "400", description = "查詢參數錯誤", content = @Content),
            @ApiResponse(responseCode = "500", description = "知識庫搜尋失敗", content = @Content)
    })
    @GetMapping(value = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> search(
            @Parameter(description = "搜尋關鍵字", required = true, example = "小半天高架橋")
            @RequestParam("query") String query,
            @Parameter(description = "回傳前幾筆最相關內容", example = "3")
            @RequestParam(defaultValue = "3") int topK) {

        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("query 不可為空");
        }
        if (topK <= 0) {
            throw new IllegalArgumentException("topK 必須大於 0");
        }

        String result = knowledgeService.search(query, topK);

        return Map.of(
                "query", query,
                "topK", topK,
                "result", result == null ? "" : result
        );
    }

    @GetMapping(value = "/documents", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Document> searchRaw(
            @RequestParam("query") String query,
            @RequestParam(defaultValue = "3") int topK) {

        if (query == null || query.isBlank()) {
            throw new IllegalArgumentException("query 不可為空");
        }
        if (topK <= 0) {
            throw new IllegalArgumentException("topK 必須大於 0");
        }

        return knowledgeService.searchRaw(query, topK);
    }

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Map<String, Object> addKnowledge(
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> body) {

        String content = body.get("content");
        String source = body.getOrDefault("source", "manual");

        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("content 不可為空");
        }

        knowledgeService.addKnowledge(content, source);

        return Map.of(
                "message", "知識已新增",
                "source", source
        );
    }
}