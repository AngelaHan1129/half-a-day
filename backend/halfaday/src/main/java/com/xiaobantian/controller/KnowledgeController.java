package com.xiaobantian.controller;

import com.xiaobantian.service.KnowledgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.web.bind.annotation.*;

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
            description = "依照查詢字串從知識庫中搜尋最相關的內容，回傳整理後的文字結果。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得搜尋結果",
                    content = @Content(mediaType = "text/plain", schema = @Schema(type = "string"))
            ),
            @ApiResponse(responseCode = "400", description = "查詢參數錯誤", content = @Content)
    })
    @GetMapping("/search")
    public String search(
            @Parameter(description = "搜尋關鍵字", required = true, example = "小半天高架橋")
            @RequestParam("query") String query,
            @Parameter(description = "回傳前幾筆最相關內容", example = "3")
            @RequestParam(defaultValue = "3") int topK) {
        return knowledgeService.search(query, topK);
    }

    @Operation(
            summary = "原始文件搜尋",
            description = "依照查詢字串從知識庫中搜尋原始文件內容，適合用來除錯或查看檢索結果。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得文件清單",
                    content = @Content(
                            mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = Document.class))
                    )
            ),
            @ApiResponse(responseCode = "400", description = "查詢參數錯誤", content = @Content)
    })
    @GetMapping("/documents")
    public List<Document> searchRaw(
            @Parameter(description = "搜尋關鍵字", required = true, example = "德興瀑布")
            @RequestParam("query") String query,
            @Parameter(description = "回傳前幾筆最相關文件", example = "3")
            @RequestParam(defaultValue = "3") int topK) {
        return knowledgeService.searchRaw(query, topK);
    }

    @Operation(
            summary = "新增知識內容",
            description = "將一段新的內容寫入知識庫，來源可指定，未提供時預設為 manual。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功新增知識",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = Map.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求格式錯誤或 content 缺漏", content = @Content)
    })
    @PostMapping
    public Map<String, String> addKnowledge(
            @RequestBody(
                    description = "知識庫新增資料，至少要提供 content，可選擇提供 source",
                    required = true
            )
            @org.springframework.web.bind.annotation.RequestBody Map<String, String> body) {

        String content = body.get("content");
        String source = body.getOrDefault("source", "manual");
        knowledgeService.addKnowledge(content, source);
        return Map.of("message", "知識已新增");
    }
}