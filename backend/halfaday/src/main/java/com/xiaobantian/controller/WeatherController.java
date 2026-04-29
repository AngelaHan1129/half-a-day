package com.xiaobantian.controller;

import com.xiaobantian.dto.WeatherInfo;
import com.xiaobantian.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@Tag(name = "Weather Controller", description = "目前天氣查詢相關 API")
public class WeatherController {

    private final WeatherService weatherService;

    @Operation(
            summary = "查詢目前天氣",
            description = "依照城市名稱或經緯度查詢目前天氣資訊。若同時提供 city 與座標，系統可依服務邏輯決定使用哪一組條件。"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "成功取得目前天氣資訊",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = WeatherInfo.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "請求參數錯誤", content = @Content),
            @ApiResponse(responseCode = "500", description = "伺服器查詢天氣失敗", content = @Content)
    })
    @GetMapping("/current")
    public WeatherInfo current(
            @Parameter(description = "城市名稱，例如 Taichung 或 Taipei", required = false, example = "Taichung")
            @RequestParam(required = false) String city,

            @Parameter(description = "緯度", required = false, example = "23.6100")
            @RequestParam(required = false) Double lat,

            @Parameter(description = "經度", required = false, example = "120.9600")
            @RequestParam(required = false) Double lon
    ) {
        return weatherService.getCurrentWeather(city, lat, lon);
    }
}