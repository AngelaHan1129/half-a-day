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

    public Place create(Place place) {
        validatePlace(place);
        return placeRepository.save(place);
    }

    public Place update(Long id, Place updatedPlace) {
        validatePlace(updatedPlace);

        Place existing = findById(id);
        existing.setName(updatedPlace.getName());
        existing.setType(updatedPlace.getType());
        existing.setDescription(updatedPlace.getDescription());
        existing.setAddress(updatedPlace.getAddress());
        existing.setPhone(updatedPlace.getPhone());
        existing.setOpeningHours(updatedPlace.getOpeningHours());
        existing.setAvgPrice(updatedPlace.getAvgPrice());
        existing.setImageUrls(updatedPlace.getImageUrls());
        existing.setMapUrl(updatedPlace.getMapUrl());
        existing.setLatitude(updatedPlace.getLatitude());
        existing.setLongitude(updatedPlace.getLongitude());

        return placeRepository.save(existing);
    }

    public void delete(Long id) {
        Place existing = findById(id);
        placeRepository.delete(existing);
    }

    private void validatePlace(Place place) {
        if (place.getName() == null || place.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name 不可為空");
        }

        if (place.getType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "type 不可為空");
        }
    }

    public List<Place> createBatch(List<Place> places) {
    if (places == null || places.isEmpty()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "places 不可為空");
    }
    for (Place place : places) {
        validatePlace(place);
    }
    return placeRepository.saveAll(places);
}
}