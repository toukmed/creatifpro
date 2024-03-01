package com.management.creatifpro.controller;

import com.management.creatifpro.dto.ProjetDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.service.ProjetService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/projets")
public class ProjetController {

    private final ProjetService projetService;

    @PostMapping
    public Page<ProjetDto> allProjects(@RequestBody SearchDto searchDto){
        return projetService.findAll(searchDto);
    }

    @PostMapping("/create")
    public ResponseEntity<ProjetDto> create(@RequestBody  ProjetDto projetDto){
        return ResponseEntity.ok(projetService.create(projetDto));
    }

    @PutMapping("/update")
    public ResponseEntity<ProjetDto> update(@RequestBody ProjetDto projetDto){
        return ResponseEntity.ok(projetService.update(projetDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjetDto> update(@PathVariable Long id){
        return ResponseEntity.ok(projetService.findById(id));
    }
}
