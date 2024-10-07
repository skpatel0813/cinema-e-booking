package com.cinema.controller;

import com.cinema.model.Seat;
import com.cinema.service.SeatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    @Autowired
    private SeatService seatService;

    // Endpoint to get reserved seats for a specific movie and showtime
    @GetMapping("/getReservedSeats")
    public ResponseEntity<List<Seat>> getReservedSeats(@RequestParam int movieId, @RequestParam String showtime) {
        List<Seat> reservedSeats = seatService.getReservedSeats(movieId, showtime);
        return ResponseEntity.ok(reservedSeats);
    }

    // Endpoint to reserve a seat for a specific movie and showtime
    @PostMapping("/reserveSeat")
    public ResponseEntity<String> reserveSeat(@RequestParam int seatId, @RequestParam int movieId, @RequestParam String showtime) {
        try {
            seatService.reserveSeat(seatId, movieId, showtime);
            System.out.println("Showtime value: " + showtime);

            return ResponseEntity.ok("Seat reserved successfully");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Endpoint to get all seats (available, reserved, etc.)
    @GetMapping("/getSeats")
    public ResponseEntity<List<Seat>> getSeats() {
        List<Seat> seats = seatService.getAllSeats();
        return ResponseEntity.ok(seats);
    }

    /**
     * Endpoint to release seats for a specific movie and showtime.
     */
    @PostMapping("/releaseSeats")
    public void releaseSeats(@RequestBody Map<String, Object> payload) {
        int movieId = Integer.parseInt(payload.get("movieId").toString());  // Convert movieId to int
        String showtime = (String) payload.get("showtime");

        // Extract seat IDs from a list of seat maps
        List<Map<String, Object>> seatMaps = (List<Map<String, Object>>) payload.get("seats");
        List<Integer> seatIds = seatMaps.stream()
                .map(seat -> Integer.parseInt(seat.get("id").toString()))  // Extract id field
                .collect(Collectors.toList());

        seatService.releaseSeats(movieId, showtime, seatIds);
    }


}
