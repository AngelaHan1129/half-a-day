package com.xiaobantian.service;

import com.xiaobantian.dto.PythonAnalyzeResponse;
import com.xiaobantian.dto.SoundFlowerCreateRequest;
import com.xiaobantian.dto.SoundFlowerResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class SoundFlowerService {

    private final PythonAnalysisClient pythonAnalysisClient;

    @Value("${feature.sound-flower.python-enabled:false}")
    private boolean pythonEnabled;

    public SoundFlowerService(PythonAnalysisClient pythonAnalysisClient) {
        this.pythonAnalysisClient = pythonAnalysisClient;
    }

    public SoundFlowerResponse createSoundFlower(
            SoundFlowerCreateRequest request,
            MultipartFile audioFile
    ) throws Exception {

        validateAudioFile(audioFile);

        String id = "sf_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        String filename = audioFile.getOriginalFilename() != null ? audioFile.getOriginalFilename() : "audio.mp3";
        String audioUrl = "https://example.com/uploads/audio/" + id + "-" + filename;

        Map<String, Object> features;
        Map<String, Object> flowerParams;
        String description;

        if (pythonEnabled) {
            PythonAnalyzeResponse analysis = pythonAnalysisClient.analyzeSoundFlower(audioFile, request.location());
            features = analysis.features();
            flowerParams = analysis.flowerParams();
            description = analysis.description();
        } else {
            features = Map.of(
                    "bass", 0.62,
                    "mid", 0.48,
                    "treble", 0.71,
                    "energy", 0.66,
                    "variance", 0.29
            );

            flowerParams = Map.of(
                    "petalCount", 14,
                    "petalLength", 156,
                    "petalWidth", 68,
                    "roundness", 0.73,
                    "particleCount", 210,
                    "hueA", 118,
                    "hueB", 214
            );

            description = "這是一朵以自然律動與高頻能量生成的聲音之花（目前為 mock 分析結果）";
        }

        return new SoundFlowerResponse(
                id,
                "done",
                request.location(),
                request.visitorName(),
                audioUrl,
                null,
                description,
                features,
                flowerParams,
                OffsetDateTime.now()
        );
    }

    private void validateAudioFile(MultipartFile audioFile) {
        if (audioFile == null || audioFile.isEmpty()) {
            throw new IllegalArgumentException("音訊檔案不可為空");
        }

        String contentType = audioFile.getContentType();
        if (contentType == null || !contentType.startsWith("audio/")) {
            throw new IllegalArgumentException("只允許音訊檔案上傳");
        }

        long maxSize = 20 * 1024 * 1024;
        if (audioFile.getSize() > maxSize) {
            throw new IllegalArgumentException("檔案大小不可超過 20MB");
        }
    }
}