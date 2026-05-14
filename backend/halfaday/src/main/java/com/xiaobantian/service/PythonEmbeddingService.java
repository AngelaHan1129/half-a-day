package com.xiaobantian.service;

import com.xiaobantian.dto.EmbeddingRequest;
import com.xiaobantian.dto.EmbeddingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PythonEmbeddingService {

    private final WebClient.Builder webClientBuilder;

    @Value("${embedding.service.base-url}")
    private String baseUrl;

    public List<Double> embed(String text) {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        EmbeddingResponse response = webClient.post()
                .uri("/embeddings")
                .bodyValue(new EmbeddingRequest(text, true))
                .retrieve()
                .bodyToMono(EmbeddingResponse.class)
                .block();

        if (response == null || response.data() == null || response.data().isEmpty()) {
            throw new IllegalStateException("Embedding service 回傳為空");
        }

        return response.data().get(0).embedding();
    }

    public List<List<Double>> embedAll(List<String> texts) {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        EmbeddingResponse response = webClient.post()
                .uri("/embeddings")
                .bodyValue(new EmbeddingRequest(texts, true))
                .retrieve()
                .bodyToMono(EmbeddingResponse.class)
                .block();

        if (response == null || response.data() == null || response.data().isEmpty()) {
            throw new IllegalStateException("Embedding service 回傳為空");
        }

        return response.data().stream()
                .map(item -> item.embedding())
                .toList();
    }
}