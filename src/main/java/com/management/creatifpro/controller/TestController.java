package com.management.creatifpro.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TestController {

    @PostMapping("/list")
    public List<String> getList(){
        return List.of("logged");
    }
}
