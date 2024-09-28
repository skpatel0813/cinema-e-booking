package com.cinema.service;

import com.cinema.model.Seat;
import com.cinema.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SeatService {

    @Autowired
    private SeatRepository seatRepository;

    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    public List<Seat> getReservedSeats(Long movieId, String showtime) {
        return seatRepository.findByMovieIdAndShowtimeAndReserved(movieId, showtime, true);
    }

    @Transactional
    public boolean reserveSeats(List<Integer> seatIds, Long movieId, String showtime) {
        System.out.println("Reserving seats: " + seatIds + " for movieId: " + movieId + " at showtime: " + showtime);

        List<Seat> seatsToReserve = seatRepository.findAllById(seatIds);

        // Validate seats and movie/showtime combination
        for (Seat seat : seatsToReserve) {
            if (seat.isReserved()) {
                System.out.println("Seat is already reserved: Seat ID = " + seat.getId());
                return false; // The seat is already reserved
            }
            if (seat.getMovieId() == null) {
                System.out.println("Seat has null movieId: Seat ID = " + seat.getId());
                // Update the movieId and showtime here
                seat.setMovieId(movieId);
                seat.setShowtime(showtime);
                System.out.println("Updated Seat movieId and showtime: " + seat.getId() + " movieId: " + seat.getMovieId() + " showtime: " + seat.getShowtime());
            } else if (!seat.getMovieId().equals(movieId)) {
                System.out.println("Seat movieId does not match: Seat ID = " + seat.getId() + ", Seat movieId = " + seat.getMovieId() + ", Requested movieId = " + movieId);
                return false; // The seat's movieId does not match the requested movieId
            }
            if (!seat.getShowtime().equals(showtime)) {
                System.out.println("Seat showtime does not match: Seat ID = " + seat.getId() + ", Seat showtime = " + seat.getShowtime() + ", Requested showtime = " + showtime);
                // Update the showtime here
                seat.setShowtime(showtime);
                System.out.println("Updated Seat showtime: " + seat.getId() + " showtime: " + seat.getShowtime());
            }
        }

        // Reserve all the seats
        for (Seat seat : seatsToReserve) {
            seat.setReserved(true);
        }

        try {
            seatRepository.saveAll(seatsToReserve);
            return true;
        } catch (Exception e) {
            System.out.println("Error saving reserved seats: " + e.getMessage());
            return false;
        }
    }
}
