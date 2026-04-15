package com.xiaobantian.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.document.Document;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KnowledgeService {

    private final RagService ragService;

    public String search(String query, int topK) {
        return ragService.retrieveContext(query, topK);
    }

    public List<Document> searchRaw(String query, int topK) {
        return ragService.searchDocuments(query, topK);
    }

    public void addKnowledge(String content, String source) {
        ragService.addText(content, source);
    }
}