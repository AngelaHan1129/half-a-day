package com.xiaobantian.controller;

import com.xiaobantian.dto.RecommendRequest;
import com.xiaobantian.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    /** 一般推薦 */
    @PostMapping
    public String recommend(@RequestBody RecommendRequest req) {
        return recommendService.recommend(req);
    }

    /** Streaming 推薦（前端即時顯示） */
    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> recommendStream(@RequestBody RecommendRequest req) {
        return recommendService.recommendStream(req);
    }
}