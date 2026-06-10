package com.xiaobantian.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class RagKnowledgeService {

    private final KnowledgeVectorService knowledgeVectorService;

    public RagKnowledgeService(KnowledgeVectorService knowledgeVectorService) {
        this.knowledgeVectorService = knowledgeVectorService;
    }

    public void addKnowledge(String content, String source) {
        knowledgeVectorService.addDocument(content, source);
        log.info("[RagKnowledgeService] addKnowledge success, source={}", source);
    }
}