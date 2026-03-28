package com.management.creatifpro.factures.controllers;

import com.management.creatifpro.factures.models.dtos.FactureRequestDto;
import com.management.creatifpro.factures.models.dtos.FactureResponseDto;
import com.management.creatifpro.factures.services.FactureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/factures")
public class FactureController {

    private final FactureService factureService;

    @PostMapping
    public ResponseEntity<List<FactureResponseDto>> findAll() {
        return ok(factureService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FactureResponseDto> getById(@PathVariable Long id) {
        return ok(factureService.getById(id));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<FactureResponseDto> create(@RequestBody FactureRequestDto dto) {
        return ok(factureService.create(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<FactureResponseDto> update(@RequestBody FactureRequestDto dto) {
        return ok(factureService.update(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        factureService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

