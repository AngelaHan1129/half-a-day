package com.xiaobantian.tool;

import com.xiaobantian.model.Route;
import com.xiaobantian.repository.RouteRepository;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RouteTool {

    private final RouteRepository routeRepository;

    public RouteTool(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    @Tool(description = "取得所有旅遊路線")
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Tool(description = "依 ID 取得路線詳細資訊")
    public Route getRouteById(
            @ToolParam(description = "路線 ID") Long id) {
        return routeRepository.findById(id).orElse(null);
    }

    @Tool(description = "依關鍵字搜尋路線，搜尋範圍包含名稱與描述")
    public List<Route> searchRoutesByKeyword(
            @ToolParam(description = "搜尋關鍵字") String keyword) {
        return routeRepository.findByNameContaining(keyword);
    }

    @Tool(description = "依最大時數篩選路線，回傳時長在指定小時數以內的路線")
    public List<Route> getRoutesByMaxDuration(
            @ToolParam(description = "最大時長（小時）") int maxHours) {
        return routeRepository.findByDurationHoursLessThanEqual(maxHours);
    }

    @Tool(description = "依適合季節篩選路線，季節請填 spring、summer、autumn、winter")
    public List<Route> getRoutesBySeason(
            @ToolParam(description = "季節：spring、summer、autumn、winter") String season) {
        return routeRepository.findBySuitableSeasonsContaining(season);
    }
}