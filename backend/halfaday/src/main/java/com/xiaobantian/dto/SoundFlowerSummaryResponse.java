package com.xiaobantian.dto;

import java.time.OffsetDateTime;

public record SoundFlowerSummaryResponse(
        String id,
        String location,
        String visitorName,
        String audioUrl,
        String imageUrl,
        String description,
        String status,
        OffsetDateTime createdAt
) {
}