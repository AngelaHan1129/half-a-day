package com.xiaobantian.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xiaobantian.dto.AddKnowledgeRequest;
import com.xiaobantian.dto.AddKnowledgeResponse;
import com.xiaobantian.dto.KnowledgeResponse;
import com.xiaobantian.model.KnowledgeItem;
import com.xiaobantian.repository.KnowledgeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.xiaobantian.dto.KnowledgeDocumentResponse;
import com.xiaobantian.dto.KnowledgeSearchResponse;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class KnowledgeService {

    private final KnowledgeRepository knowledgeRepository;
    private final ObjectMapper objectMapper;
    private final RagKnowledgeService ragKnowledgeService;

    public KnowledgeService(
            KnowledgeRepository knowledgeRepository,
            ObjectMapper objectMapper,
            RagKnowledgeService ragKnowledgeService
    ) {
        this.knowledgeRepository = knowledgeRepository;
        this.objectMapper = objectMapper;
        this.ragKnowledgeService = ragKnowledgeService;
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

    public AddKnowledgeResponse addKnowledge(AddKnowledgeRequest request) {
        try {
            if (request == null || request.getContent() == null || request.getContent().isBlank()) {
                throw new IllegalArgumentException("知識內容不可為空");
            }

            String source = (request.getSource() == null || request.getSource().isBlank())
                    ? "manual"
                    : request.getSource().trim();

            String content = request.getContent().trim();

            ragKnowledgeService.addKnowledge(content, source);

            log.info("[KnowledgeService] knowledge added successfully, source={}, contentLength={}",
                    source, content.length());

            return new AddKnowledgeResponse("知識已成功寫入知識庫", source);
        } catch (Exception e) {
            log.error("[KnowledgeService] addKnowledge failed, source={}, message={}",
                    request == null ? null : request.getSource(),
                    e.getMessage(), e);
            throw e;
        }
    }

    public KnowledgeSearchResponse search(String query, Integer topK) {
        try {
            if (query == null || query.isBlank()) {
                throw new IllegalArgumentException("搜尋關鍵字不可為空");
            }

            int finalTopK = (topK == null || topK < 1) ? 3 : topK;

            KnowledgeSearchResponse result = ragKnowledgeService.search(query.trim(), finalTopK);

            log.info("[KnowledgeService] search success, query={}, topK={}", query, finalTopK);
            return result;
        } catch (Exception e) {
            log.error("[KnowledgeService] search failed, query={}, topK={}, message={}",
                    query, topK, e.getMessage(), e);
            throw e;
        }
    }

    public List<KnowledgeDocumentResponse> searchDocuments(String query, Integer topK) {
        try {
            if (query == null || query.isBlank()) {
                throw new IllegalArgumentException("搜尋關鍵字不可為空");
            }

            int finalTopK = (topK == null || topK < 1) ? 3 : topK;

            List<KnowledgeDocumentResponse> documents =
                    ragKnowledgeService.searchDocuments(query.trim(), finalTopK);

            log.info("[KnowledgeService] searchDocuments success, query={}, topK={}, size={}",
                    query, finalTopK, documents.size());

            return documents;
        } catch (Exception e) {
            log.error("[KnowledgeService] searchDocuments failed, query={}, topK={}, message={}",
                    query, topK, e.getMessage(), e);
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