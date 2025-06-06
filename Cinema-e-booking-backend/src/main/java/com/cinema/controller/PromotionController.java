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

    /**
     * Retrieves all promotions.
     *
     * @return A list of promotions.
     */
    @GetMapping("/getPromotions")
    public List<Promotion> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    /**
     * Adds a new promotion.
     *
     * @param payload JSON payload containing promotion details.
     * @return The saved Promotion object.
     */
    @PostMapping("/addPromotions")
    public ResponseEntity<Promotion> createPromotion(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.get("code");
        String description = (String) payload.get("description");

        String discountAmountString = (String) payload.get("discountAmount");
        float discountAmount = Float.parseFloat(discountAmountString);


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
        float discountAmount;
        try {
            discountAmount = new BigDecimal(discountStr).floatValue(); // Convert BigDecimal to float
        } catch (NumberFormatException | NullPointerException e) {
            return ResponseEntity.badRequest().body(null); // Return 400 if discountAmount is not a valid number
        }

        // Call the service method to update the promotion
        Promotion updatedPromotion = promotionService.updatePromotion(code, description, discountAmount);
        return ResponseEntity.ok(updatedPromotion);
    }


    @DeleteMapping("/delete/{code}")
    public ResponseEntity<String> deletePromotionByCode(@PathVariable String code) {
        try {
            promotionService.deletePromotionByCode(code); // Call service to handle deletion
            return ResponseEntity.ok("Promotion deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting promotion: " + e.getMessage());
        }
    }


    // Send promotion to subscribers
    @PostMapping("/send")
    public void sendPromotion(@RequestBody String promotionMessage) {
        List<String> subscribedEmails = userService.getSubscribedUserEmails();
        emailService.sendPromotionEmails(subscribedEmails, promotionMessage);
    }

    @GetMapping("/getPromotionByCode")
    public ResponseEntity<Promotion> getPromotionByCode(@RequestParam String code) {
        Promotion promotion = promotionService.getPromotionByCode(code);
        if (promotion != null) {
            return ResponseEntity.ok(promotion);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

}
