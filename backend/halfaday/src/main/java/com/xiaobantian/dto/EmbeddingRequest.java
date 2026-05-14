package com.xiaobantian.dto;

import java.util.List;

public record EmbeddingRequest(
        Object input,
        boolean normalize
) {}