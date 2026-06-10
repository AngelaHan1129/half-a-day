package com.xiaobantian.controller;

import com.xiaobantian.dto.KnowledgeDocumentResponse;
import com.xiaobantian.dto.KnowledgeSearchResponse;
import com.xiaobantian.service.RagKnowledgeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/rag")
public class RagKnowledgeController {

    private final RagKnowledgeService ragKnowledgeService;

    public RagKnowledgeController(RagKnowledgeService ragKnowledgeService) {
        this.ragKnowledgeService = ragKnowledgeService;
    }

    @GetMapping("/search")
    public KnowledgeSearchResponse search(
            @RequestParam String query,
            @RequestParam(defaultValue = "3") int topK
    ) {
        log.info("[RAG] SEARCH query={}, topK={}", query, topK);
        return ragKnowledgeService.search(query, topK);
    }

    @GetMapping("/documents")
    public List<KnowledgeDocumentResponse> documents(
            @RequestParam String query,
            @RequestParam(defaultValue = "3") int topK
    ) {
        log.info("[RAG] DOCUMENTS query={}, topK={}", query, topK);
        return ragKnowledgeService.searchDocuments(query, topK);
    }
}