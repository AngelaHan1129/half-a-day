package com.xiaobantian.dto;

import java.util.List;

public record EmbeddingResponse(
        String model,
        int dimension,
        List<EmbeddingItem> data
) {}