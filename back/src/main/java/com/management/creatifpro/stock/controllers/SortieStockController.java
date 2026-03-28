package com.management.creatifpro.stock.controllers;

import com.management.creatifpro.stock.models.dtos.SortieStockRequestDto;
import com.management.creatifpro.stock.models.dtos.SortieStockResponseDto;
import com.management.creatifpro.stock.services.SortieStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stock/sorties")
public class SortieStockController {

    private final SortieStockService sortieStockService;

    @PostMapping
    public ResponseEntity<List<SortieStockResponseDto>> findAll() {
        return ok(sortieStockService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SortieStockResponseDto> getById(@PathVariable Long id) {
        return ok(sortieStockService.getById(id));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<SortieStockResponseDto> create(@RequestBody SortieStockRequestDto dto) {
        return ok(sortieStockService.create(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<SortieStockResponseDto> update(@RequestBody SortieStockRequestDto dto) {
        return ok(sortieStockService.update(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sortieStockService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
