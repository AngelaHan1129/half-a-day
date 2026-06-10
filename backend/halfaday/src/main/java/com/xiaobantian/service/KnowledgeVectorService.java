package com.xiaobantian.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class KnowledgeVectorService {

    public void addDocument(String content, String source) {
        log.info("[KnowledgeVectorService] mock addDocument, source={}, contentLength={}",
                source, content == null ? 0 : content.length());

        // TODO:
        // 1. chunk content
        // 2. call embedding service
        // 3. write vectors into pgvector / vector_store
        // 4. save metadata(source, chunk index, etc.)
    }
}