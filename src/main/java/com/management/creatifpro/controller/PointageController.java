package com.management.creatifpro.controller;

import com.management.creatifpro.dto.PointageDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.service.PointageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pointages")
public class PointageController {

    private final PointageService pointageService;

    @PostMapping
    public Page<PointageDto> allPointages(@RequestBody SearchDto searchDto){
        return pointageService.findAll(searchDto);
    }

    @PostMapping("/create")
    public ResponseEntity<PointageDto> create(@RequestBody @Valid PointageDto pointageDto){
        return ResponseEntity.ok(pointageService.create(pointageDto));
    }

    @PutMapping("/update")
    public ResponseEntity<PointageDto> update(@RequestBody  PointageDto pointageDto){
        return ResponseEntity.ok(pointageService.update(pointageDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PointageDto> update(@PathVariable Long id){
        return ResponseEntity.ok(pointageService.findById(id));
    }

}
