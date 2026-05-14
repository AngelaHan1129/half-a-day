package com.xiaobantian.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RagService {

    private final VectorStore vectorStore;

    public RagService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public String retrieveContext(String query, int topK) {
        try {
            List<Document> documents = vectorStore.similaritySearch(
                    SearchRequest.builder()
                            .query(query)
                            .topK(topK)
                            .similarityThreshold(0.0)
                            .build()
            );

            if (documents == null || documents.isEmpty()) {
                return "";
            }

            return documents.stream()
                    .map(doc -> "【參考資料】\n" + doc.getText())
                    .collect(Collectors.joining("\n\n"));
        } catch (Exception ex) {
            throw new RuntimeException("知識庫語意搜尋失敗", ex);
        }
    }

    public void addDocuments(List<Document> documents) {
        try {
            vectorStore.add(documents);
        } catch (Exception ex) {
            throw new RuntimeException("知識文件批次新增失敗", ex);
        }
    }

    public void addText(String content, String source) {
        try {
            Document document = new Document(content, Map.of("source", source));
            vectorStore.add(List.of(document));
        } catch (Exception ex) {
            throw new RuntimeException("知識內容新增失敗", ex);
        }
    }

    public List<Document> searchDocuments(String query, int topK) {
        try {
            return vectorStore.similaritySearch(
                    SearchRequest.builder()
                            .query(query)
                            .topK(topK)
                            .similarityThreshold(0.0)
                            .build()
            );
        } catch (Exception ex) {
            throw new RuntimeException("知識原始文件搜尋失敗", ex);
        }
    }
}