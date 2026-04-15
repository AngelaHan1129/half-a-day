package com.xiaobantian.service;

import com.xiaobantian.model.Place;
import com.xiaobantian.model.PlaceType;
import com.xiaobantian.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;

    public List<Place> findAll() {
        return placeRepository.findAll();
    }

    public Place findById(Long id) {
        return placeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到景點 id=" + id));
    }

    public List<Place> findByType(PlaceType type) {
        return placeRepository.findByType(type);
    }

    public List<Place> searchByKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return placeRepository.findAll();
        }
        return placeRepository.findByNameContaining(keyword);
    }

    public List<Place> searchByLocation(String location) {
        if (location == null || location.isBlank()) {
            return placeRepository.findAll();
        }
        return placeRepository.findByAddressContaining(location);
    }
}