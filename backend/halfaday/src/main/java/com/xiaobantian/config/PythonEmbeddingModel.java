package com.xiaobantian.config;

import com.xiaobantian.dto.EmbeddingItem;
import com.xiaobantian.dto.EmbeddingRequest;
import org.springframework.ai.document.Document;
import org.springframework.ai.embedding.Embedding;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.embedding.EmbeddingResponse;
import org.springframework.ai.embedding.EmbeddingResponseMetadata;
import org.springframework.context.annotation.Primary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.IntStream;

@Component
@Primary
public class PythonEmbeddingModel implements EmbeddingModel {

    private final WebClient webClient;
    private final int dimensions;

    public PythonEmbeddingModel(
            WebClient.Builder builder,
            @Value("${embedding.service.base-url}") String baseUrl,
            @Value("${spring.ai.vectorstore.pgvector.dimensions:1024}") int dimensions
    ) {
        this.webClient = builder.baseUrl(baseUrl).build();
        this.dimensions = dimensions;
    }

    @Override
    public float[] embed(Document document) {
        return embed(document.getText());
    }

    @Override
    public float[] embed(String text) {
        com.xiaobantian.dto.EmbeddingResponse response = webClient.post()
                .uri("/embeddings")
                .bodyValue(new EmbeddingRequest(text, true))
                .retrieve()
                .bodyToMono(com.xiaobantian.dto.EmbeddingResponse.class)
                .block();

        if (response == null || response.data() == null || response.data().isEmpty()) {
            throw new IllegalStateException("Python embedding service returned empty response");
        }

        return toFloatArray(response.data().get(0).embedding());
    }

    @Override
    public List<float[]> embed(List<String> texts) {
        com.xiaobantian.dto.EmbeddingResponse response = webClient.post()
                .uri("/embeddings")
                .bodyValue(new EmbeddingRequest(texts, true))
                .retrieve()
                .bodyToMono(com.xiaobantian.dto.EmbeddingResponse.class)
                .block();

        if (response == null || response.data() == null || response.data().isEmpty()) {
            throw new IllegalStateException("Python embedding service returned empty response");
        }

        return response.data().stream()
                .map(EmbeddingItem::embedding)
                .map(this::toFloatArray)
                .toList();
    }

    @Override
    public EmbeddingResponse call(org.springframework.ai.embedding.EmbeddingRequest request) {
        List<String> texts = request.getInstructions();
        List<float[]> vectors = embed(texts);

        List<Embedding> embeddings = IntStream.range(0, vectors.size())
                .mapToObj(i -> new Embedding(vectors.get(i), i))
                .toList();

        return new EmbeddingResponse(
                embeddings,
                new EmbeddingResponseMetadata()
        );
    }

    @Override
    public int dimensions() {
        return dimensions;
    }

    private float[] toFloatArray(List<Double> vector) {
        float[] result = new float[vector.size()];
        for (int i = 0; i < vector.size(); i++) {
            result[i] = vector.get(i).floatValue();
        }
        return result;
    }
}