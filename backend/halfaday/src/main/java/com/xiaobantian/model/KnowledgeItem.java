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
@Table(name = "knowledge_item") // 可依你的資料表名稱調整
public class KnowledgeItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String detectedClass;   // "bamboo", "tea_leaf", "plum" 等
    private String region;          // "小半天"
    private String title;
    private String shortIntro;      // ≤100字，辨識後即時顯示
    private String fullIntro;       // 詳情頁用
    private String arGlbPath;       // e.g. "/models/bamboo.glb"
    private String arUsdzPath;      // e.g. "/models/bamboo.usdz"
    private String tags;            // JSON: ["竹炭","竹藝","竹林步道"]
    private String relatedClasses;  // JSON: ["bamboo_charcoal","tea_leaf"]
    // getters/setters...
}