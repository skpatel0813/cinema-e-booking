package com.cinema.controller;

import com.cinema.model.Order;
import com.cinema.repository.MovieRepository;
import com.cinema.repository.OrderRepository;
import com.cinema.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private MovieRepository movieRepository;

    /**
     * Saves a new order to the database.
     *
     * @param order The order object to be saved.
     * @return ResponseEntity indicating success or failure of the operation.
     */
    @PostMapping("/save")
    public ResponseEntity<String> saveOrder(@RequestBody Order order) {
        try {
            orderRepository.save(order);
            return ResponseEntity.ok("Order saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving order: " + e.getMessage());
        }
    }

    /**
     * Retrieves all orders for a specific user by email.
     *
     * @param email The email of the user.
     * @return ResponseEntity containing a list of orders for the user.
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Order>> getOrdersByEmail(@PathVariable String email) {
        List<Order> orders = orderRepository.findByUserEmail(email);
        return ResponseEntity.ok(orders);
    }


    /**
     * Cancels an order and releases the associated seats.
     *
     * @param payload JSON payload containing order ID, movie title, and seat details.
     * @return ResponseEntity indicating success or failure of the cancellation.
     */
    @PostMapping("/cancel")
    public ResponseEntity<String> cancelOrder(@RequestBody Map<String, Object> payload) {
        try {
            Long orderId = Long.valueOf(payload.get("orderId").toString());
            String movieTitle = (String) payload.get("movieTitle");
            List<Map<String, Object>> seats = (List<Map<String, Object>>) payload.get("seats");

            // Validate payload
            if (orderId == null || movieTitle == null || seats == null || seats.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid payload: orderId, movieTitle, and seats are required.");
            }

            // Get movieId using movieTitle
            Integer movieId = movieRepository.findMovieIdByTitle(movieTitle);
            if (movieId == null) {
                return ResponseEntity.badRequest().body("Movie not found for title: " + movieTitle);
            }

            // Call service to handle cancellation
            orderService.cancelOrder(orderId, movieId, seats);

            return ResponseEntity.ok("Order and associated seats successfully canceled.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error canceling order: " + e.getMessage());
        }
    }







}
