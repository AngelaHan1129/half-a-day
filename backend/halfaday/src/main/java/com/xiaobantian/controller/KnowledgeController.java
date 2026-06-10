package com.xiaobantian.controller;

import com.xiaobantian.dto.AddKnowledgeRequest;
import com.xiaobantian.dto.AddKnowledgeResponse;
import com.xiaobantian.dto.KnowledgeResponse;
import com.xiaobantian.service.KnowledgeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/knowledge")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    public KnowledgeController(KnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
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
}