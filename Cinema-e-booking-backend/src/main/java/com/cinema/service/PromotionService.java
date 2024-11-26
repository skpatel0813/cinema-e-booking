package com.cinema.service;

import com.cinema.model.Promotion;
import com.cinema.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    /**
     * Retrieves all promotions.
     * @return a list of promotions.
     */
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    /**
     * Creates a new promotion.
     * @param code promotion code.
     * @param description promotion description.
     * @param discountAmount discount amount.
     * @return the created promotion.
     */
    public Promotion createPromotion(String code, String description, float discountAmount) {
        Promotion promotion = new Promotion();
        promotion.setPromotionCode(code);
        promotion.setDescription(description);
        promotion.setDiscountAmount(discountAmount);
        return promotionRepository.save(promotion);
    }


    /**
     * Updates an existing promotion identified by the promotion code.
     *
     * @param code The unique code of the promotion to update.
     * @param description Updated description of the promotion.
     * @param discountAmount Updated discount amount.
     * @return The updated Promotion object.
     */
    public Promotion updatePromotion(String code, String description, float discountAmount) {
        Promotion promotion = promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Promotion not found with id " + code));

        promotion.setDescription(description);
        promotion.setDiscountAmount(discountAmount);

        return promotionRepository.save(promotion);
    }


    /**
     * Deletes a promotion identified by the promotion code.
     *
     * @param code The unique promotion code.
     */
    public void deletePromotionByCode(String code) {
        Promotion promotion = promotionRepository.findByPromotionCode(code);
        if (promotion != null) {
            promotionRepository.delete(promotion);
        } else {
            throw new RuntimeException("Promotion not found with code: " + code);
        }
    }

    /**
     * Retrieves a promotion by its unique promotion code.
     *
     * @param code The promotion code to look up.
     * @return The Promotion object if found, otherwise null.
     */
    public Promotion getPromotionByCode(String code) {
        return promotionRepository.findByCode(code).orElse(null);
    }

}
