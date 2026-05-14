package com.xiaobantian.dto;

import java.util.List;

public record EmbeddingItem(
        int index,
        List<Double> embedding
) {}