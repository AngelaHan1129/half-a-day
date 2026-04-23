package com.xiaobantian.dto;

import java.time.OffsetDateTime;
import java.util.Map;

public record SoundFlowerResponse(
        String id,
        String status,
        String location,
        String visitorName,
        String audioUrl,
        String imageUrl,
        String description,
        Map<String, Object> features,
        Map<String, Object> flowerParams,
        OffsetDateTime createdAt
) {
}