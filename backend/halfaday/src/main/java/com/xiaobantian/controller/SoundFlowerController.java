package com.xiaobantian.controller;

import com.xiaobantian.dto.SoundFlowerCreateRequest;
import com.xiaobantian.dto.SoundFlowerResponse;
import com.xiaobantian.service.SoundFlowerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/sound-flowers")
@Tag(name = "Sound Flower Controller", description = "聲音花錄音上傳與紀錄建立相關 API")
public class SoundFlowerController {

    private final SoundFlowerService soundFlowerService;

    public SoundFlowerController(SoundFlowerService soundFlowerService) {
        this.soundFlowerService = soundFlowerService;
    }

    @Operation(
            summary = "建立聲音花紀錄",
            description = "上傳一段音檔與相關資訊，系統會建立一筆聲音花紀錄並回傳處理結果。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功建立聲音花紀錄",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = SoundFlowerResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求格式錯誤或缺少必要欄位", content = @Content),
            @ApiResponse(responseCode = "500", description = "伺服器處理失敗", content = @Content)
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SoundFlowerResponse> createSoundFlower(
            @Parameter(
                    description = "音檔上傳欄位",
                    required = true,
                    content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE)
            )
            @RequestParam("audio") MultipartFile audio,

            @Parameter(description = "錄音地點", required = true, example = "小半天高架橋")
            @RequestParam("location") String location,

            @Parameter(description = "訪客名稱", required = false, example = "王小明")
            @RequestParam(value = "visitorName", required = false) String visitorName,

            @Parameter(description = "裝置 ID", required = false, example = "device-001")
            @RequestParam(value = "deviceId", required = false) String deviceId,

            @Parameter(description = "錄音秒數", required = false, example = "32")
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