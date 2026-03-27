package com.management.creatifpro.employees.controllers;

import com.management.creatifpro.employees.models.dtos.EmployeeRequestDto;
import com.management.creatifpro.employees.models.dtos.EmployeeResponseDto;
import com.management.creatifpro.employees.models.dtos.SearchEmployeeRequestDto;
import com.management.creatifpro.employees.services.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<Page<EmployeeResponseDto>> search(@RequestBody SearchEmployeeRequestDto dto) {
        return ok(employeeService.search(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDto> getById(@PathVariable Long id) {
        return ok(employeeService.getById(id));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<EmployeeResponseDto> create(@RequestBody @Valid EmployeeRequestDto dto) {
        return ok(employeeService.create(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<EmployeeResponseDto> update(@RequestBody @Valid EmployeeRequestDto dto) {
        return ok(employeeService.update(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
