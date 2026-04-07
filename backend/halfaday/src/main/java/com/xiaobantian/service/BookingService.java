package com.xiaobantian.service;

import com.xiaobantian.model.Booking;
import com.xiaobantian.model.BookingStatus;
import com.xiaobantian.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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

    public Booking confirm(Long id) {
        Booking b = bookingRepository.findById(id).orElseThrow();
        b.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(b);
    }

    public Booking cancel(Long id) {
        Booking b = bookingRepository.findById(id).orElseThrow();
        b.setStatus(BookingStatus.CANCELLED);
        return bookingRepository.save(b);
    }

    public List<Booking> findPending() {
        return bookingRepository.findByStatus(BookingStatus.PENDING);
    }
}