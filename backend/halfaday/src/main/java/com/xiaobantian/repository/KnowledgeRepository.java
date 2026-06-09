package com.xiaobantian.repository;

import com.xiaobantian.model.KnowledgeItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KnowledgeRepository extends JpaRepository<KnowledgeItem, Long> {

    Optional<KnowledgeItem> findByDetectedClassAndRegion(String detectedClass, String region);

    Optional<KnowledgeItem> findByDetectedClass(String detectedClass);

    List<KnowledgeItem> findByDetectedClassInAndRegion(List<String> detectedClasses, String region);
}