package com.xiaobantian.controller;

import com.xiaobantian.dto.AddKnowledgeRequest;
import com.xiaobantian.dto.AddKnowledgeResponse;
import com.xiaobantian.dto.KnowledgeDocumentResponse;
import com.xiaobantian.dto.KnowledgeResponse;
import com.xiaobantian.dto.KnowledgeSearchResponse;
import com.xiaobantian.service.KnowledgeService;
import com.xiaobantian.service.RagKnowledgeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/knowledge")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;
    private final RagKnowledgeService ragKnowledgeService;

    public KnowledgeController(
            KnowledgeService knowledgeService,
            RagKnowledgeService ragKnowledgeService
    ) {
        this.knowledgeService = knowledgeService;
        this.ragKnowledgeService = ragKnowledgeService;
    }

    @GetMapping
    public KnowledgeResponse getKnowledge(
            @RequestParam String detectedClass,
            @RequestParam(required = false, defaultValue = "小半天") String region
    ) {
        log.info("[Knowledge] GET detectedClass={}, region={}", detectedClass, region);
        return knowledgeService.getKnowledge(detectedClass, region);
    }

    @PostMapping
    public AddKnowledgeResponse addKnowledge(@RequestBody AddKnowledgeRequest request) {
        log.info("[Knowledge] POST source={}, contentLength={}",
                request.getSource(),
                request.getContent() == null ? 0 : request.getContent().length());

        return knowledgeService.addKnowledge(request);
    }

    @GetMapping("/search")
    public KnowledgeSearchResponse searchKnowledge(
            @RequestParam String query,
            @RequestParam(defaultValue = "3") int topK
    ) {
        log.info("[Knowledge] SEARCH query={}, topK={}", query, topK);
        return ragKnowledgeService.search(query, topK);
    }

    @GetMapping("/documents")
    public List<KnowledgeDocumentResponse> searchKnowledgeDocuments(
            @RequestParam String query,
            @RequestParam(defaultValue = "3") int topK
    ) {
        log.info("[Knowledge] DOCUMENTS query={}, topK={}", query, topK);
        return ragKnowledgeService.searchDocuments(query, topK);
    }
}