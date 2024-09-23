package com.cinema.controller;

import com.cinema.model.Promotion;
import com.cinema.service.EmailService;
import com.cinema.service.PromotionService;
import com.cinema.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @GetMapping("/getPromotions")
    public List<Promotion> getAllPromotions() {
        return promotionService.getAllPromotions();
    }

    @PostMapping("/addPromotions")
    public Promotion addPromotion(@RequestBody Promotion promotion) {
        return promotionService.addPromotion(promotion);
    }

    @PutMapping("/updatePromotion")
    public Promotion updatePromotion(@RequestBody Promotion promotion) {
        return promotionService.updatePromotion(promotion);
    }

    @DeleteMapping("/{id}")
    public void deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
    }

    @PostMapping("/send")
    public void sendPromotion(@RequestBody String promotionMessage) {
        List<String> subscribedEmails = userService.getSubscribedUserEmails();
        emailService.sendPromotionEmails(subscribedEmails, promotionMessage);
    }
}
