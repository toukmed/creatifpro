package com.management.creatifpro.stock.controllers;

import com.management.creatifpro.stock.models.dtos.EntreeStockRequestDto;
import com.management.creatifpro.stock.models.dtos.EntreeStockResponseDto;
import com.management.creatifpro.stock.services.EntreeStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stock/entrees")
public class EntreeStockController {

    private final EntreeStockService entreeStockService;

    @PostMapping
    public ResponseEntity<List<EntreeStockResponseDto>> findAll() {
        return ok(entreeStockService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntreeStockResponseDto> getById(@PathVariable Long id) {
        return ok(entreeStockService.getById(id));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<EntreeStockResponseDto> create(@RequestBody EntreeStockRequestDto dto) {
        return ok(entreeStockService.create(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<EntreeStockResponseDto> update(@RequestBody EntreeStockRequestDto dto) {
        return ok(entreeStockService.update(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        entreeStockService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
