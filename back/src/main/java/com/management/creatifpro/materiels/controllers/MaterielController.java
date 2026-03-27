package com.management.creatifpro.materiels.controllers;

import com.management.creatifpro.materiels.models.dtos.MaterielRequestDto;
import com.management.creatifpro.materiels.models.dtos.MaterielResponseDto;
import com.management.creatifpro.materiels.services.MaterielService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/materiels")
public class MaterielController {

    private final MaterielService materielService;

    @PostMapping
    public ResponseEntity<List<MaterielResponseDto>> findAll() {
        return ok(materielService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterielResponseDto> getById(@PathVariable Long id) {
        return ok(materielService.getById(id));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<MaterielResponseDto> create(@RequestBody MaterielRequestDto dto) {
        return ok(materielService.create(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<MaterielResponseDto> update(@RequestBody MaterielRequestDto dto) {
        return ok(materielService.update(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        materielService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
