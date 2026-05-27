package com.xiaobantian.repository;

import com.xiaobantian.model.KnowledgeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KnowledgeItemRepository extends JpaRepository<KnowledgeItem, Long> {
    
    // 補上這個查詢方法，讓 Spring Data JPA 自動實作
    Optional<KnowledgeItem> findFirstByDetectedClassAndRegion(String detectedClass, String region);
}