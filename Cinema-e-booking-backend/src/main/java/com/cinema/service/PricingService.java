package com.cinema.service;

import com.cinema.model.Pricing;
import com.cinema.repository.PricingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PricingService {

    @Autowired
    private PricingRepository pricingRepository;

    // Method to get pricing information
    public Pricing getPricing() {
        // Fetch the pricing entry with ID 1 (assuming this is the only record)
        return pricingRepository.findById(1L).orElse(new Pricing());
    }

    // Method to update pricing information
    public Pricing updatePricing(Pricing pricing) {
        // Fetch the existing pricing entry with ID 1
        Pricing existingPricing = pricingRepository.findById(1L).orElse(new Pricing());

        // Update the fields with new values
        existingPricing.setAdultPrice(pricing.getAdultPrice());
        existingPricing.setChildrenPrice(pricing.getChildrenPrice());
        existingPricing.setSeniorPrice(pricing.getSeniorPrice());
        existingPricing.setFee(pricing.getFee());

        // Save and return the updated pricing entry
        return pricingRepository.save(existingPricing);
    }
}
