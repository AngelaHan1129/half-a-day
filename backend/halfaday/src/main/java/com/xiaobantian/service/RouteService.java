package com.xiaobantian.service;

import com.xiaobantian.model.Route;
import com.xiaobantian.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;

    public List<Route> findAll() {
        return routeRepository.findAll();
    }

    public Route findById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到遊程 id=" + id));
    }

    public List<Route> searchByKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return routeRepository.findAll();
        }
        return routeRepository.findByNameContaining(keyword);
    }

    public List<Route> findByMaxHours(Integer maxHours) {
        return routeRepository.findByDurationHoursLessThanEqual(maxHours);
    }

    public List<Route> findBySeason(String season) {
        return routeRepository.findBySuitableSeasonsContaining(season);
    }

    public Route create(Route route) {
    return routeRepository.save(route);
}

public Route update(Long id, Route route) {
    Route existing = routeRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到指定路線"));

    existing.setName(route.getName());
    existing.setDescription(route.getDescription());
    existing.setDurationHours(route.getDurationHours());
    existing.setSuitableSeasons(route.getSuitableSeasons());
    existing.setDifficulty(route.getDifficulty());
    existing.setGroupSizeNote(route.getGroupSizeNote());
    existing.setCoverImage(route.getCoverImage());

    return routeRepository.save(existing);
}

public void delete(Long id) {
    Route existing = routeRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到指定路線"));
    routeRepository.delete(existing);
}
}