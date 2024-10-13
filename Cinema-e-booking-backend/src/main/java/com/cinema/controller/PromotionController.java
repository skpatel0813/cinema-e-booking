package com.cinema.controller;

import com.cinema.model.Promotion;
import com.cinema.service.EmailService;
import com.cinema.service.PromotionService;
import com.cinema.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    // Fetch all promotions
    @GetMapping("/getPromotions")
    public List<Promotion> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    @PostMapping("/addPromotions")
    public ResponseEntity<Promotion> createPromotion(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.get("code");
        String description = (String) payload.get("description");
        BigDecimal discountAmount = new BigDecimal((String) payload.get("discountAmount"));

        Promotion promotion = promotionService.createPromotion(code, description, discountAmount);
        return ResponseEntity.ok(promotion);
    }

    @PutMapping("/updatePromotion")
    public ResponseEntity<Promotion> updatePromotion(@RequestBody Map<String, Object> payload) {
        // Extract fields from payload, handle potential null values
        String code = (String) payload.get("code");
        String description = (String) payload.get("description");
        String discountStr = payload.get("discountAmount") != null ? payload.get("discountAmount").toString() : null;

        // Check if any required fields are missing, return a 400 response if so
        if (code == null || description == null || discountStr == null) {
            return ResponseEntity.badRequest().body(null);
        }

        // Attempt to parse discount amount
        BigDecimal discountAmount;
        try {
            discountAmount = new BigDecimal(discountStr);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(null); // Return 400 if discountAmount is not a valid number
        }

        // Call the service method to update the promotion
        Promotion updatedPromotion = promotionService.updatePromotion(code, description, discountAmount);
        return ResponseEntity.ok(updatedPromotion);
    }



    // Delete a promotion
    @DeleteMapping("/{id}")
    public void deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
    }

    // Send promotion to subscribers
    @PostMapping("/send")
    public void sendPromotion(@RequestBody String promotionMessage) {
        List<String> subscribedEmails = userService.getSubscribedUserEmails();
        emailService.sendPromotionEmails(subscribedEmails, promotionMessage);
    }
}
