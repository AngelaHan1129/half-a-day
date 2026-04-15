package com.xiaobantian.controller;

import com.xiaobantian.model.Place;
import com.xiaobantian.model.PlaceType;
import com.xiaobantian.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping
    public List<Place> findAll() {
        return placeService.findAll();
    }

    @GetMapping("/{id}")
    public Place findById(@PathVariable Long id) {
        return placeService.findById(id);
    }

    @GetMapping("/type/{type}")
    public List<Place> findByType(@PathVariable PlaceType type) {
        return placeService.findByType(type);
    }

    @GetMapping("/search")
    public List<Place> search(@RequestParam String keyword) {
        return placeService.searchByKeyword(keyword);
    }

    @GetMapping("/location")
    public List<Place> searchByLocation(@RequestParam String q) {
        return placeService.searchByLocation(q);
    }
}