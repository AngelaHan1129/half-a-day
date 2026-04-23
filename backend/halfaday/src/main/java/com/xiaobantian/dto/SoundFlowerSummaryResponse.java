package com.xiaobantian.dto;

import java.time.OffsetDateTime;

public record SoundFlowerSummaryResponse(
        String id,
        String location,
        String imageUrl,
        String description,
        OffsetDateTime createdAt
) {
}