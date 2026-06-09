package com.xiaobantian.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xiaobantian.dto.KnowledgeResponse;
import com.xiaobantian.model.KnowledgeItem;
import com.xiaobantian.repository.KnowledgeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class KnowledgeService {

    private final KnowledgeRepository knowledgeRepository;
    private final ObjectMapper objectMapper;

    public KnowledgeService(KnowledgeRepository knowledgeRepository, ObjectMapper objectMapper) {
        this.knowledgeRepository = knowledgeRepository;
        this.objectMapper = objectMapper;
    }

    public KnowledgeResponse getKnowledge(String detectedClass, String region) {
        try {
            log.info("[KnowledgeService] start detectedClass={}, region={}", detectedClass, region);

            if (detectedClass == null || detectedClass.isBlank()) {
                log.warn("[KnowledgeService] detectedClass is blank");
                return KnowledgeResponse.empty();
            }

            String finalRegion = (region == null || region.isBlank()) ? "小半天" : region;
            log.info("[KnowledgeService] finalRegion={}", finalRegion);

            KnowledgeItem item = knowledgeRepository
                .findByDetectedClassAndRegion(detectedClass, finalRegion)
                .orElseGet(() -> knowledgeRepository.findByDetectedClass(detectedClass).orElse(null));

            log.info("[KnowledgeService] item found={}", item != null);

            if (item == null) {
                log.warn("[KnowledgeService] knowledge item not found for detectedClass={}, region={}", detectedClass, finalRegion);
                return KnowledgeResponse.unknown(detectedClass);
            }

            List<String> relatedClasses = parseStringList(item.getRelatedClasses());
            log.info("[KnowledgeService] relatedClasses={}", relatedClasses);

            List<KnowledgeResponse.RelatedItem> relatedItems = relatedClasses.isEmpty()
                ? Collections.emptyList()
                : knowledgeRepository.findByDetectedClassInAndRegion(relatedClasses, finalRegion)
                    .stream()
                    .map(k -> new KnowledgeResponse.RelatedItem(k.getDetectedClass(), k.getTitle()))
                    .collect(Collectors.toList());

            log.info("[KnowledgeService] relatedItems size={}", relatedItems.size());

            KnowledgeResponse response = KnowledgeResponse.from(item, relatedItems);
            log.info("[KnowledgeService] response built successfully for detectedClass={}", detectedClass);

            return response;
        } catch (Exception e) {
            log.error("[KnowledgeService] getKnowledge failed detectedClass={}, region={}, message={}",
                    detectedClass, region, e.getMessage(), e);
            throw e;
        }
    }

    private List<String> parseStringList(String json) {
        if (json == null || json.isBlank()) {
            return Collections.emptyList();
        }

        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            log.warn("[KnowledgeService] parseStringList failed, json={}", json, e);
            return Collections.emptyList();
        }
    }
}