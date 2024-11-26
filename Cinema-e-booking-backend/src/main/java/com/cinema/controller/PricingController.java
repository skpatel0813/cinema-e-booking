package com.cinema.controller;

import com.cinema.model.Pricing;
import com.cinema.service.PricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pricing")
public class PricingController {


    @Autowired
    private PricingService pricingService;

    /**
     * Retrieves current pricing details.
     *
     * @return A Pricing object containing current prices.
     */
    @GetMapping("/getPrices")
    public Pricing getPricing() {

        System.out.println("Fetched Pricing: " + pricingService.getPricing());

        return pricingService.getPricing();
    }

    /**
     * Updates pricing details.
     *
     * @param pricing A Pricing object containing updated pricing information.
     * @return The updated Pricing object.
     */
    @PostMapping("/updatePrices")
    public Pricing updatePricing(@RequestBody Pricing pricing) {

        System.out.println(pricing);
        return pricingService.updatePricing(pricing);
    }
}
