package com.cinema.controller;

import com.cinema.model.Seat;
import com.cinema.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    @GetMapping("/getSeats")
    public ResponseEntity<List<Seat>> getAllSeats() {
        List<Seat> seats = seatService.getAllSeats();
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/getReservedSeats")
    public ResponseEntity<List<Seat>> getReservedSeats(@RequestParam Long movieId, @RequestParam String showtime) {
        List<Seat> reservedSeats = seatService.getReservedSeats(movieId, showtime);
        return ResponseEntity.ok(reservedSeats);
    }

    @PostMapping("/reserve")
    public ResponseEntity<?> reserveSeats(@RequestBody Map<String, Object> request) {
        List<Integer> seatIds = (List<Integer>) request.get("seats");
        Long movieId = Long.valueOf(request.get("movieId").toString());
        String showtime = (String) request.get("showtime");

        if (seatIds == null || seatIds.isEmpty() || movieId == null || showtime == null) {
            return ResponseEntity.badRequest().body("Invalid request data");
        }

        // Debugging: Log the incoming payload
        System.out.println("Received reservation request for seats: " + seatIds + ", movieId: " + movieId + ", showtime: " + showtime);

        boolean success = seatService.reserveSeats(seatIds, movieId, showtime);

        if (success) {
            return ResponseEntity.ok("Seats reserved successfully");
        } else {
            return ResponseEntity.status(500).body("Failed to reserve seats");
        }
    }
}
