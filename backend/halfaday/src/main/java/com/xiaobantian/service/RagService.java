package com.xiaobantian.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RagService {

    private final VectorStore vectorStore;
    private final EmbeddingModel embeddingModel;

    public RagService(VectorStore vectorStore, EmbeddingModel embeddingModel) {
        this.vectorStore = vectorStore;
        this.embeddingModel = embeddingModel;
    }

    public String retrieveContext(String query, int topK) {
        List<Document> documents = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(query)
                        .topK(topK)
                        .build()
        );

        if (documents == null || documents.isEmpty()) {
            return "";
        }

        return documents.stream()
                .map(doc -> "【參考資料】\n" + doc.getText())
                .collect(Collectors.joining("\n\n"));
    }

    public void addDocuments(List<Document> documents) {
        vectorStore.add(documents);
    }

    public void addText(String content, String source) {
        Document document = new Document(content, Map.of("source", source));
        vectorStore.add(List.of(document));
    }

    public List<Document> searchDocuments(String query, int topK) {
        return vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(query)
                        .topK(topK)
                        .build()
        );
    }
}