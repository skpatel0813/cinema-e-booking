package com.cinema.service;

import com.cinema.model.Order;
import com.cinema.repository.OrderRepository;
import com.cinema.repository.ReservationRepository;
import com.cinema.repository.SeatRepository;
import com.cinema.service.SeatService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private SeatService seatService;

    @Autowired
    private ReservationRepository reservationRepository;

    /*
    @Transactional
    public void deleteOrderAndReleaseSeats(String movieTitle, String showtime, List<String> letters, List<Integer> numbers) {
        if (letters == null || numbers == null || letters.size() != numbers.size()) {
            throw new IllegalArgumentException("Invalid seat data: letters and numbers must not be null and must have the same size.");
        }

        // Release the seats based on letter and number
        for (int i = 0; i < letters.size(); i++) {
            String letter = letters.get(i);
            int number = numbers.get(i);

            seatRepository.findByRowAndNumberAndShowtime(letter, number, showtime)
                    .ifPresent(seat -> {
                        seat.setReserved(false);
                        seatRepository.save(seat);
                    });
        }

        // Delete orders matching the movieTitle and showtime
        List<Order> orders = orderRepository.findByMovieTitleAndShowtime(movieTitle, showtime);
        if (!orders.isEmpty()) {
            orderRepository.deleteAll(orders);
        } else {
            throw new IllegalStateException("No orders found for the specified movie title and showtime.");
        }
    }

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
