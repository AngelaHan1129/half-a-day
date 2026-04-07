package com.xiaobantian.repository;

import com.xiaobantian.model.Booking;
import com.xiaobantian.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmail(String userEmail);
    List<Booking> findByRouteId(Long routeId);
    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findByUserEmailAndStatus(String userEmail, BookingStatus status);
}