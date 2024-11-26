package com.cinema.service;

import com.cinema.model.Pricing;
import com.cinema.repository.PricingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PricingService {

    @Autowired
    private PricingRepository pricingRepository;

    /**
     * Retrieves pricing information.
     * @return pricing details.
     */
    public Pricing getPricing() {
        Pricing pricing = pricingRepository.findById(1L).orElse(new Pricing());
        System.out.println("Fetched Pricing: " + pricing.toString());
        return pricing;
    }


    /**
     * Updates pricing information.
     * @param pricing updated pricing details.
     * @return the updated pricing.
     */
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
