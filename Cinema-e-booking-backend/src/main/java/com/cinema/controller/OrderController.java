package com.cinema.controller;

import com.cinema.model.Order;
import com.cinema.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @PostMapping("/save")
    public ResponseEntity<String> saveOrder(@RequestBody Order order) {
        try {
            orderRepository.save(order);
            return ResponseEntity.ok("Order saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving order: " + e.getMessage());
        }
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Order>> getOrdersByEmail(@PathVariable String email) {
        List<Order> orders = orderRepository.findByUserEmail(email);
        return ResponseEntity.ok(orders);
    }
}
