package com.xiaobantian.controller;

import com.xiaobantian.dto.WeatherInfo;
import com.xiaobantian.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/current")
    public WeatherInfo current(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon
    ) {
        return weatherService.getCurrentWeather(city, lat, lon);
    }
}