package com.xiaobantian.controller;

import com.xiaobantian.dto.SoundFlowerCreateRequest;
import com.xiaobantian.dto.SoundFlowerResponse;
import com.xiaobantian.service.SoundFlowerService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/sound-flowers")
public class SoundFlowerController {

    private final SoundFlowerService soundFlowerService;

    public SoundFlowerController(SoundFlowerService soundFlowerService) {
        this.soundFlowerService = soundFlowerService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SoundFlowerResponse> createSoundFlower(
            @RequestParam("audio") MultipartFile audio,
            @RequestParam("location") String location,
            @RequestParam(value = "visitorName", required = false) String visitorName,
            @RequestParam(value = "deviceId", required = false) String deviceId,
            @RequestParam(value = "recordedSeconds", required = false) Integer recordedSeconds
    ) throws Exception {

        SoundFlowerCreateRequest request = new SoundFlowerCreateRequest(
                location,
                visitorName,
                deviceId,
                recordedSeconds
        );

        SoundFlowerResponse response = soundFlowerService.createSoundFlower(request, audio);
        return ResponseEntity.ok(response);
    }
}