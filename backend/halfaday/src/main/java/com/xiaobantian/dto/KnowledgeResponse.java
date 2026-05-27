// ============================================================
// src/main/java/com/xiaobantian/dto/KnowledgeResponse.java
// ============================================================
package com.xiaobantian.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xiaobantian.model.KnowledgeItem;

import java.util.Collections;
import java.util.List;

public class KnowledgeResponse {

    private boolean      found;
    private String       title;
    private String       shortIntro;
    private String       arGlbPath;
    private String       arUsdzPath;
    private List<String> tags;
    private List<RelatedItem> relatedItems;

    // ── 靜態工廠 ────────────────────────────────────────────

    /** 信心值不足，直接回空 */
    public static KnowledgeResponse empty() {
        return new KnowledgeResponse(
            false, null, null, null, null,
            Collections.emptyList(), Collections.emptyList()
        );
    }

    /** 有辨識到 class 但資料庫沒有對應知識 */
    public static KnowledgeResponse unknown(String className) {
        return new KnowledgeResponse(
            false,
            "未收錄的物件",
            "「" + className + "」目前尚未有小半天相關知識，歡迎回報給我們！",
            null, null,
            Collections.emptyList(), Collections.emptyList()
        );
    }

    /** 從 KnowledgeItem entity 轉換，relatedItems 由 controller 補入 */
    public static KnowledgeResponse from(
        KnowledgeItem k,
        List<RelatedItem> relatedItems
    ) {
        ObjectMapper mapper = new ObjectMapper();
        List<String> tags;
        try {
            tags = mapper.readValue(
                k.getTags() != null ? k.getTags() : "[]",
                new TypeReference<List<String>>() {}
            );
        } catch (Exception e) {
            tags = Collections.emptyList();
        }

        return new KnowledgeResponse(
            true,
            k.getTitle(),
            k.getShortIntro(),
            k.getArGlbPath(),
            k.getArUsdzPath(),
            tags,
            relatedItems != null ? relatedItems : Collections.emptyList()
        );
    }

    // ── 建構子 ──────────────────────────────────────────────
    public KnowledgeResponse() {}

    public KnowledgeResponse(
        boolean found, String title, String shortIntro,
        String arGlbPath, String arUsdzPath,
        List<String> tags, List<RelatedItem> relatedItems
    ) {
        this.found        = found;
        this.title        = title;
        this.shortIntro   = shortIntro;
        this.arGlbPath    = arGlbPath;
        this.arUsdzPath   = arUsdzPath;
        this.tags         = tags;
        this.relatedItems = relatedItems;
    }

    // ── getters / setters ────────────────────────────────────
    public boolean isFound()                       { return found; }
    public void    setFound(boolean v)             { this.found = v; }

    public String getTitle()                       { return title; }
    public void   setTitle(String v)               { this.title = v; }

    public String getShortIntro()                  { return shortIntro; }
    public void   setShortIntro(String v)          { this.shortIntro = v; }

    public String getArGlbPath()                   { return arGlbPath; }
    public void   setArGlbPath(String v)           { this.arGlbPath = v; }

    public String getArUsdzPath()                  { return arUsdzPath; }
    public void   setArUsdzPath(String v)          { this.arUsdzPath = v; }

    public List<String> getTags()                  { return tags; }
    public void         setTags(List<String> v)    { this.tags = v; }

    public List<RelatedItem> getRelatedItems()     { return relatedItems; }
    public void setRelatedItems(List<RelatedItem> v) { this.relatedItems = v; }

    // ── 內部 Record：相關特色物件 ─────────────────────────────
    public static class RelatedItem {
        private String className;
        private String title;

        public RelatedItem() {}
        public RelatedItem(String className, String title) {
            this.className = className;
            this.title     = title;
        }
        public String getClassName()         { return className; }
        public void   setClassName(String v) { this.className = v; }
        public String getTitle()             { return title; }
        public void   setTitle(String v)     { this.title = v; }
    }
}