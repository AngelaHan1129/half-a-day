package com.xiaobantian.service;

import com.xiaobantian.dto.PythonAnalyzeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class PythonAnalysisClient {

    private final WebClient webClient;
    private final String pythonBaseUrl;

    public PythonAnalysisClient(
            WebClient webClient,
            @Value("${python.analysis.base-url:http://localhost:8000}") String pythonBaseUrl
    ) {
        this.webClient = webClient;
        this.pythonBaseUrl = pythonBaseUrl;
    }

    public PythonAnalyzeResponse analyzeSoundFlower(
            MultipartFile audioFile,
            String location
    ) throws Exception {

        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("location", location);

        builder.part("audio", new ByteArrayResource(audioFile.getBytes()) {
            @Override
            public String getFilename() {
                return audioFile.getOriginalFilename();
            }
        }).contentType(MediaType.parseMediaType(
                audioFile.getContentType() != null ? audioFile.getContentType() : "audio/mpeg"
        ));

        try {
            return webClient.post()
                    .uri(pythonBaseUrl + "/internal/analyze-sound-flower")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .bodyValue(builder.build())
                    .retrieve()
                    .bodyToMono(PythonAnalyzeResponse.class)
                    .block();
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Python analysis service 呼叫失敗：" + ex.getMessage()
            );
        }
    }
}