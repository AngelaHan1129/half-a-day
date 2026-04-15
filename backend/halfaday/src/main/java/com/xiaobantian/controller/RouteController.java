package com.xiaobantian.controller;

import com.xiaobantian.model.Route;
import com.xiaobantian.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public List<Route> findAll() {
        return routeService.findAll();
    }

    @GetMapping("/{id}")
    public Route findById(@PathVariable Long id) {
        return routeService.findById(id);
    }

    @GetMapping("/search")
    public List<Route> search(@RequestParam String keyword) {
        return routeService.searchByKeyword(keyword);
    }

    @GetMapping("/duration")
    public List<Route> findByDuration(@RequestParam Integer maxHours) {
        return routeService.findByMaxHours(maxHours);
    }

    @GetMapping("/season/{season}")
    public List<Route> findBySeason(@PathVariable String season) {
        return routeService.findBySeason(season);
    }
}