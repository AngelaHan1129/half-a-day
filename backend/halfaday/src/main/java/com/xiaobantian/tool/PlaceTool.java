package com.xiaobantian.tool;

import com.xiaobantian.model.Place;
import com.xiaobantian.model.PlaceType;
import com.xiaobantian.repository.PlaceRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PlaceTool {

    private final PlaceRepository placeRepository;

    public PlaceTool(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    @Tool(description = "根據關鍵字搜尋景點、餐廳或住宿，搜尋範圍包含名稱與描述")
    public List<Place> searchPlacesByKeyword(
            @ToolParam(description = "搜尋關鍵字") String keyword) {
        return placeRepository.findAll().stream()
                .filter(p -> p.getName().contains(keyword) ||
                        (p.getDescription() != null && p.getDescription().contains(keyword)))
                .collect(Collectors.toList());
    }

    @Tool(description = "依類型取得地點，類型可為 SCENIC_SPOT、RESTAURANT、HOTEL、ACTIVITY")
    public List<Place> getPlacesByType(
            @ToolParam(description = "地點類型：SCENIC_SPOT、RESTAURANT、HOTEL、ACTIVITY") String type) {
        try {
            PlaceType placeType = PlaceType.valueOf(type.toUpperCase());
            return placeRepository.findByType(placeType);
        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    @Tool(description = "取得所有地點清單")
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    @Tool(description = "依地址中的城市或區域名稱篩選地點")
    public List<Place> getPlacesByLocation(
            @ToolParam(description = "城市或區域名稱") String location) {
        return placeRepository.findByAddressContaining(location);
    }

    @Tool(description = "依 ID 取得單一地點詳細資訊")
    public Place getPlaceById(
            @ToolParam(description = "地點 ID") Long id) {
        return placeRepository.findById(id).orElse(null);
    }
}