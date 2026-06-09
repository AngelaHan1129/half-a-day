package com.xiaobantian.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "knowledge_item")
public class KnowledgeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String detectedClass;   // e.g. "bamboo_grove", "tea_field", "ginkgo_forest"
    private String region;          // e.g. "小半天"
    private String title;
    private String shortIntro;      // 辨識後即時顯示
    private String fullIntro;       // 詳情頁使用
    private String arGlbPath;       // e.g. "/models/bamboo.glb"
    private String arUsdzPath;      // e.g. "/models/bamboo.usdz"
    private String tags;            // JSON string: ["竹藝","竹林步道"]
    private String relatedClasses;  // JSON string: ["bamboo_shoots","carpentry"]
}