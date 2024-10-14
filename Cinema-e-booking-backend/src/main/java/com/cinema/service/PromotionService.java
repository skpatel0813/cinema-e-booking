package com.cinema.service;

import com.cinema.model.Promotion;
import com.cinema.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    // Get all promotions
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    public Promotion createPromotion(String code, String description, BigDecimal discountAmount) {
        Promotion promotion = new Promotion();
        promotion.setPromotionCode(code);
        promotion.setDescription(description);
        promotion.setDiscountAmount(discountAmount);
        return promotionRepository.save(promotion);
    }



    public Promotion updatePromotion(String code, String description, BigDecimal discountAmount) {
        Promotion promotion = promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id " + code));

        promotion.setDescription(description);
        promotion.setDiscountAmount(discountAmount);

        return promotionRepository.save(promotion);
    }


    // Delete a promotion by ID
    public void deletePromotion(Long id) {
        promotionRepository.deleteById(id);
    }

    public Promotion getPromotionByCode(String code) {
        return promotionRepository.findByCode(code).orElse(null);
    }

}
