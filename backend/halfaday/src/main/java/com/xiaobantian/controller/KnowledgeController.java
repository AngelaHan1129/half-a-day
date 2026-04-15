package com.xiaobantian.controller;

import com.xiaobantian.service.KnowledgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/knowledge")
@RequiredArgsConstructor
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    @GetMapping("/search")
    public String search(@RequestParam String query,
                         @RequestParam(defaultValue = "3") int topK) {
        return knowledgeService.search(query, topK);
    }

    @GetMapping("/documents")
    public List<Document> searchRaw(@RequestParam String query,
                                    @RequestParam(defaultValue = "3") int topK) {
        return knowledgeService.searchRaw(query, topK);
    }

    @PostMapping
    public Map<String, String> addKnowledge(@RequestBody Map<String, String> body) {
        String content = body.get("content");
        String source = body.getOrDefault("source", "manual");
        knowledgeService.addKnowledge(content, source);
        return Map.of("message", "知識已新增");
    }
}