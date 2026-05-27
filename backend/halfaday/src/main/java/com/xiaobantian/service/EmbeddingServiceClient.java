// ============================================================
// src/main/java/com/xiaobantian/service/EmbeddingServiceClient.java
// ============================================================
package com.xiaobantian.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Collections;
import java.util.List;

@Service
public class EmbeddingServiceClient {

    private static final Logger log = LoggerFactory.getLogger(EmbeddingServiceClient.class);

    private final WebClient webClient;
    private final boolean   enabled;

    public EmbeddingServiceClient(
        @Value("${embedding.service.base-url:http://localhost:8001}") String baseUrl,
        @Value("${embedding.service.enabled:true}")                   boolean enabled
    ) {
        this.enabled   = enabled;
        this.webClient = WebClient.builder()
            .baseUrl(baseUrl)
            .defaultHeader("Content-Type", "application/json")
            .build();
    }

    // ── DTO ─────────────────────────────────────────────────
    public record RelatedRequest(String className, int topK) {}
    public record RelatedItem(String className, String title, double score) {}

    // ── 取得相關特色推薦（同步包裝，timeout 2 秒） ──────────
    public List<RelatedItem> getRelated(String className, int topK) {
        if (!enabled) return Collections.emptyList();

        try {
            List<RelatedItem> result = webClient
                .post()
                .uri("/api/embedding/related")
                .bodyValue(new RelatedRequest(className, topK))
                .retrieve()
                .bodyToFlux(RelatedItem.class)
                .collectList()
                .timeout(Duration.ofSeconds(2))
                .onErrorResume(ex -> {
                    log.warn("[EmbeddingClient] 呼叫失敗，略過: {}", ex.getMessage());
                    return Mono.just(Collections.emptyList());
                })
                .block();

            return result != null ? result : Collections.emptyList();

        } catch (Exception ex) {
            log.warn("[EmbeddingClient] getRelated exception: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }
}