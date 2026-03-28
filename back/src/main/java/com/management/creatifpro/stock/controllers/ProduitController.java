package com.management.creatifpro.stock.controllers;

import com.management.creatifpro.stock.models.dtos.ProduitRequestDto;
import com.management.creatifpro.stock.models.dtos.ProduitResponseDto;
import com.management.creatifpro.stock.services.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stock/produits")
public class ProduitController {

    private final ProduitService produitService;

    @PostMapping
    public ResponseEntity<List<ProduitResponseDto>> findAll() {
        return ok(produitService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitResponseDto> getById(@PathVariable Long id) {
        return ok(produitService.getById(id));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<ProduitResponseDto> create(@RequestBody ProduitRequestDto dto) {
        return ok(produitService.create(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<ProduitResponseDto> update(@RequestBody ProduitRequestDto dto) {
        return ok(produitService.update(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

