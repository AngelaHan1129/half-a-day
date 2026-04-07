package com.xiaobantian.repository;

import com.xiaobantian.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Long> {
    List<Route> findByNameContaining(String keyword);
    List<Route> findByDurationHoursLessThanEqual(Integer maxHours);
    List<Route> findBySuitableSeasonsContaining(String season);
}