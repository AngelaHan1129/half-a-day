package com.xiaobantian.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class KnowledgeSearchResponse {
    private String query;
    private int topK;
    private String result;
    private String mode;
}