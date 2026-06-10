package com.xiaobantian.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeDocumentResponse {
    private String id;
    private String content;
    private Double score;
    private Map<String, Object> metadata;
}