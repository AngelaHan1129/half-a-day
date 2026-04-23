package com.xiaobantian.dto;

import java.util.Map;

public record PythonAnalyzeResponse(
        Map<String, Object> features,
        Map<String, Object> flowerParams,
        String description
) {
}