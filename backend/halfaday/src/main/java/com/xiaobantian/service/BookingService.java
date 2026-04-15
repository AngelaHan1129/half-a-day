package com.xiaobantian.service;

import com.xiaobantian.model.Booking;
import com.xiaobantian.model.BookingStatus;
import com.xiaobantian.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public Booking findById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "找不到預約 id=" + id));
    }

    public Booking confirm(Long id) {
        Booking b = findById(id);
        b.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(b);
    }

    public Booking cancel(Long id) {
        Booking b = findById(id);
        b.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(b);
    }

    public Booking complete(Long id) {
        Booking b = findById(id);
        b.setStatus(BookingStatus.COMPLETED);
        return bookingRepository.save(b);
    }

    public List<Booking> findPending() {
        return bookingRepository.findByStatus(BookingStatus.PENDING);
    }

    public List<Booking> findByUserEmail(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    public List<Booking> findByRouteId(Long routeId) {
        return bookingRepository.findByRouteId(routeId);
    }

    public List<Booking> findByUserEmailAndStatus(String userEmail, BookingStatus status) {
        return bookingRepository.findByUserEmailAndStatus(userEmail, status);
    }
}