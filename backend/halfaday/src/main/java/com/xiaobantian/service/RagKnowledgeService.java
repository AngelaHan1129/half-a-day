package com.xiaobantian.service;

import com.xiaobantian.dto.KnowledgeDocumentResponse;
import com.xiaobantian.dto.KnowledgeSearchResponse;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RagKnowledgeService {

    private final VectorStore vectorStore;

    public RagKnowledgeService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void addKnowledge(String content, String source) {
        String normalizedContent = content == null ? "" : content.trim();
        String normalizedSource = (source == null || source.isBlank()) ? "manual" : source.trim();

        if (normalizedContent.isBlank()) {
            throw new IllegalArgumentException("知識內容不可為空");
        }

        Map<String, Object> metadata = new LinkedHashMap<>();
        metadata.put("id", UUID.randomUUID().toString());
        metadata.put("source", normalizedSource);
        metadata.put("type", "knowledge");

        Document document = new Document(normalizedContent, metadata);
        vectorStore.add(List.of(document));
    }

    public KnowledgeSearchResponse search(String query, int topK) {
        String normalizedQuery = query == null ? "" : query.trim();
        int normalizedTopK = Math.max(1, topK);

        if (normalizedQuery.isBlank()) {
            return new KnowledgeSearchResponse(
                    normalizedQuery,
                    normalizedTopK,
                    "請先輸入想搜尋的主題或關鍵字。",
                    "vector"
            );
        }

        List<KnowledgeDocumentResponse> documents = searchDocuments(normalizedQuery, normalizedTopK);

        String result;
        if (documents.isEmpty()) {
            result = "目前找不到與「" + normalizedQuery + "」相關的知識內容。";
        } else {
            result = documents.stream()
                    .map(KnowledgeDocumentResponse::getContent)
                    .filter(text -> text != null && !text.isBlank())
                    .limit(3)
                    .collect(Collectors.joining("\n\n"));
        }

        return new KnowledgeSearchResponse(
                normalizedQuery,
                normalizedTopK,
                result,
                "vector"
        );
    }

    public List<KnowledgeDocumentResponse> searchDocuments(String query, int topK) {
        String normalizedQuery = query == null ? "" : query.trim();
        int normalizedTopK = Math.max(1, topK);

        if (normalizedQuery.isBlank()) {
            return List.of();
        }

        SearchRequest request = SearchRequest.builder()
                .query(normalizedQuery)
                .topK(normalizedTopK)
                .similarityThresholdAll()
                .build();

        List<Document> results = vectorStore.similaritySearch(request);

        if (results == null || results.isEmpty()) {
            return List.of();
        }

        return results.stream()
                .map(this::toKnowledgeDocumentResponse)
                .collect(Collectors.toList());
    }

    private KnowledgeDocumentResponse toKnowledgeDocumentResponse(Document document) {
        Map<String, Object> metadata = new LinkedHashMap<>();
        if (document.getMetadata() != null) {
            metadata.putAll(document.getMetadata());
        }

        String id = metadata.get("id") != null
                ? String.valueOf(metadata.get("id"))
                : null;

        double score = extractScore(metadata);

        return new KnowledgeDocumentResponse(
                id,
                document.getText(),
                score,
                metadata
        );
    }

    private double extractScore(Map<String, Object> metadata) {
        Object scoreObj = metadata.get("score");
        if (scoreObj instanceof Number number) {
            return number.doubleValue();
        }

        Object distanceObj = metadata.get("distance");
        if (distanceObj instanceof Number number) {
            return number.doubleValue();
        }

        Object similarityObj = metadata.get("similarity");
        if (similarityObj instanceof Number number) {
            return number.doubleValue();
        }

        return 0.0;
    }
}