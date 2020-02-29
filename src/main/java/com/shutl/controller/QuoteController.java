package com.shutl.controller;

import com.shutl.model.Quote;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class QuoteController {
    Double getMarkUp(String vehicle){
        switch (vehicle){
            case "bicycle":
                return 0.1;
            case "motorbike":
                return 0.15;
            case "parcelCar":
                return 0.2;
            case "smallVan":
                return 0.3;
            case "largeVan":
                return 0.4;
            default:
                return 0.0;
        }
    }
    @CrossOrigin
    @RequestMapping(value = "/quote", method = POST)
    public @ResponseBody ResponseEntity<Quote> quote(@RequestBody Quote quote) {
        Long price = Math.abs((Long.valueOf(quote.getDeliveryPostcode(), 36) - Long.valueOf(quote.getPickupPostcode(), 36))/100000000);
        price = Math.max(10, price); //make sure that no delivery is free
        Double markUp = getMarkUp(quote.getVehicle());
        // return BAD_REQUEST if we could not calculate a valid markUp
        if(markUp == 0){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        price =Math.round(price +(price * markUp));

        return new ResponseEntity<>(new Quote(quote.getPickupPostcode(), quote.getDeliveryPostcode(), quote.getVehicle(), price), HttpStatus.OK);
    }
}
