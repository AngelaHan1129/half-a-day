package com.xiaobantian.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "embedding.service.enabled", havingValue = "false")
public class EmbeddingConfig {
    // 目前保留為空。
    // 當 embedding.service.enabled=false 時，你之後可以在這裡放 OpenAI EmbeddingModel 備援設定。
}