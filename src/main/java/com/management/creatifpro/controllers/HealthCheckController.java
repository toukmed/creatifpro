package com.management.creatifpro.controllers;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

    @PostMapping("/health")
    public String checkHealth(){
        return "Pointage service has started successfully";
    }
}
