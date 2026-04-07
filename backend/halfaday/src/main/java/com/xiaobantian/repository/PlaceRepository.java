package com.xiaobantian.repository;

import com.xiaobantian.model.Place;
import com.xiaobantian.model.PlaceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByType(PlaceType type);
    List<Place> findByNameContaining(String keyword);
    List<Place> findByAddressContaining(String location);
}