package com.xiaobantian.controller;

import com.xiaobantian.model.Booking;
import com.xiaobantian.model.BookingStatus;
import com.xiaobantian.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public Booking create(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/{id}")
    public Booking findById(@PathVariable Long id) {
        return bookingService.findById(id);
    }

    @PutMapping("/{id}/confirm")
    public Booking confirm(@PathVariable Long id) {
        return bookingService.confirm(id);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        return bookingService.cancel(id);
    }

    @PutMapping("/{id}/complete")
    public Booking complete(@PathVariable Long id) {
        return bookingService.complete(id);
    }

    @GetMapping("/pending")
    public List<Booking> pending() {
        return bookingService.findPending();
    }

    @GetMapping("/user")
    public List<Booking> byUser(@RequestParam String email) {
        return bookingService.findByUserEmail(email);
    }

    @GetMapping("/route/{routeId}")
    public List<Booking> byRoute(@PathVariable Long routeId) {
        return bookingService.findByRouteId(routeId);
    }

    @GetMapping("/user/status")
    public List<Booking> byUserAndStatus(@RequestParam String email,
                                         @RequestParam BookingStatus status) {
        return bookingService.findByUserEmailAndStatus(email, status);
    }
}