package com.xiaobantian.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xiaobantian.model.KnowledgeItem;

import java.util.Collections;
import java.util.List;

public class KnowledgeResponse {

    private boolean found;
    private String title;
    private String shortIntro;
    private String arGlbPath;
    private String arUsdzPath;
    private List<String> tags;
    private List<RelatedItem> relatedItems;

    public static KnowledgeResponse empty() {
        return new KnowledgeResponse(
            false, null, null, null, null,
            Collections.emptyList(), Collections.emptyList()
        );
    }

    public static KnowledgeResponse unknown(String className) {
        return new KnowledgeResponse(
            false,
            "未收錄的物件",
            "「" + className + "」目前尚未有小半天相關知識，歡迎回報給我們！",
            null, null,
            Collections.emptyList(), Collections.emptyList()
        );
    }

    public static KnowledgeResponse from(KnowledgeItem k, List<RelatedItem> relatedItems) {
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

    public KnowledgeResponse() {}

    public KnowledgeResponse(
        boolean found,
        String title,
        String shortIntro,
        String arGlbPath,
        String arUsdzPath,
        List<String> tags,
        List<RelatedItem> relatedItems
    ) {
        this.found = found;
        this.title = title;
        this.shortIntro = shortIntro;
        this.arGlbPath = arGlbPath;
        this.arUsdzPath = arUsdzPath;
        this.tags = tags;
        this.relatedItems = relatedItems;
    }

    public boolean isFound() { return found; }
    public void setFound(boolean found) { this.found = found; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getShortIntro() { return shortIntro; }
    public void setShortIntro(String shortIntro) { this.shortIntro = shortIntro; }

    public String getArGlbPath() { return arGlbPath; }
    public void setArGlbPath(String arGlbPath) { this.arGlbPath = arGlbPath; }

    public String getArUsdzPath() { return arUsdzPath; }
    public void setArUsdzPath(String arUsdzPath) { this.arUsdzPath = arUsdzPath; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public List<RelatedItem> getRelatedItems() { return relatedItems; }
    public void setRelatedItems(List<RelatedItem> relatedItems) { this.relatedItems = relatedItems; }

    public static class RelatedItem {
        private String className;
        private String title;

        public RelatedItem() {}

        public RelatedItem(String className, String title) {
            this.className = className;
            this.title = title;
        }

        public String getClassName() { return className; }
        public void setClassName(String className) { this.className = className; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
    }
}