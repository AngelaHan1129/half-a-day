package com.xiaobantian.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddKnowledgeRequest {
    private String content;
    private String source;
}