// ============================================================
// src/main/java/com/xiaobantian/controller/DetectionResolveController.java
// ============================================================
package com.xiaobantian.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xiaobantian.dto.DetectionRequest;
import com.xiaobantian.dto.KnowledgeResponse;
import com.xiaobantian.dto.KnowledgeResponse.RelatedItem;
import com.xiaobantian.model.KnowledgeItem;
import com.xiaobantian.repository.KnowledgeItemRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/detection")
@CrossOrigin(origins = "*") // 開發期間開放，正式環境改為指定 origin
public class DetectionResolveController {

    private static final Logger log = LoggerFactory.getLogger(DetectionResolveController.class);
    private static final double MIN_CONFIDENCE = 0.60;

    @Autowired
    private KnowledgeItemRepository repo;

    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * 前端 POST { className, confidence, locale, deviceType }
     * 回傳對應的小半天知識與 AR 模型路徑
     */
    @PostMapping("/resolve")
    public ResponseEntity<KnowledgeResponse> resolve(
        @Valid @RequestBody DetectionRequest req
    ) {
        log.info("[Detection] class={} conf={:.2f} device={}",
            req.getClassName(), req.getConfidence(), req.getDeviceType());

        // ── 1. 信心值門檻 ──
        if (req.getConfidence() < MIN_CONFIDENCE) {
            return ResponseEntity.ok(KnowledgeResponse.empty());
        }

        // ── 2. metadata 精準查詢 ──
        Optional<KnowledgeItem> itemOpt =
            repo.findFirstByDetectedClassAndRegion(req.getClassName(), "小半天");

        if (itemOpt.isEmpty()) {
            return ResponseEntity.ok(KnowledgeResponse.unknown(req.getClassName()));
        }

        KnowledgeItem item = itemOpt.get();

        // ── 3. 解析 relatedClasses JSON → RelatedItem 清單 ──
        List<RelatedItem> relatedItems = resolveRelated(item.getRelatedClasses());

        return ResponseEntity.ok(KnowledgeResponse.from(item, relatedItems));
    }

    /** 把 relatedClasses JSON 字串轉成 RelatedItem，找不到的略過 */
    private List<RelatedItem> resolveRelated(String relatedClassesJson) {
        if (relatedClassesJson == null || relatedClassesJson.isBlank()) {
            return Collections.emptyList();
        }
        try {
            List<String> classNames = mapper.readValue(
                relatedClassesJson, new TypeReference<List<String>>() {}
            );
            return classNames.stream()
                .map(cls -> repo.findFirstByDetectedClassAndRegion(cls, "小半天"))
                .filter(Optional::isPresent)
                .map(opt -> new RelatedItem(
                    opt.get().getDetectedClass(),
                    opt.get().getTitle()
                ))
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.warn("[Detection] relatedClasses parse error: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}