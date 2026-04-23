package com.xiaobantian.dto;

public record SoundFlowerCreateRequest(
        String location,
        String visitorName,
        String deviceId,
        Integer recordedSeconds
) {
}