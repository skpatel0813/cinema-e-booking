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

    @GetMapping("/getPrices")
    public Pricing getPricing() {

        System.out.println("Fetched Pricing: " + pricingService.getPricing());

        return pricingService.getPricing();
    }

    @PostMapping("/updatePrices")
    public Pricing updatePricing(@RequestBody Pricing pricing) {

        System.out.println(pricing);
        return pricingService.updatePricing(pricing);
    }
}
