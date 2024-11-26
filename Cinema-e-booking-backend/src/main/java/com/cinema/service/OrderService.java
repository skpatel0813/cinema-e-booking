package com.cinema.service;

import com.cinema.model.Order;
import com.cinema.repository.OrderRepository;
import com.cinema.repository.ReservationRepository;
import com.cinema.repository.SeatRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;


@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SeatService seatService;

    @Autowired
    private ReservationRepository reservationRepository;

    /**
     * Cancels an order and releases reserved seats.
     * @param orderId ID of the order to be canceled.
     * @param movieId ID of the movie associated with the order.
     * @param seats list of seats to be released.
     */
    @Transactional
    public void cancelOrder(Long orderId, Integer movieId, List<Map<String, Object>> seats) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalStateException("Order not found for ID: " + orderId));

        List<String> letters = seats.stream()
                .map(seat -> seat.get("letter").toString())
                .toList();

        List<Integer> numbers = seats.stream()
                .map(seat -> Integer.parseInt(seat.get("number").toString()))
                .toList();

        // Release seats and get seat IDs
        List<Integer> seatIds = seatService.releaseSeats(letters, numbers);

        // Delete reservations for the released seats
        reservationRepository.deleteByMovieIdAndShowtimeAndSeatIds(movieId, order.getShowtime(), seatIds);

        // Delete the order
        orderRepository.deleteById(orderId);
    }



}
