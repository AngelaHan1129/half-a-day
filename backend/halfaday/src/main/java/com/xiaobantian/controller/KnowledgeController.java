package com.xiaobantian.controller;

import com.xiaobantian.dto.KnowledgeResponse;
import com.xiaobantian.service.KnowledgeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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
    KnowledgeResponse response = new KnowledgeResponse();
    response.setFound(true);
    response.setTitle("測試成功");
    response.setShortIntro("如果你看到這段，代表 /api/knowledge 路由與 security 已經通了");
    response.setArGlbPath(null);
    response.setArUsdzPath(null);
    response.setTags(Collections.emptyList());
    response.setRelatedItems(Collections.emptyList());
    return response;
}
}