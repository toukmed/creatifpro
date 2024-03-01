package com.management.creatifpro.controller;

import com.management.creatifpro.dto.EmployeDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.service.EmployeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/employes")
public class EmployeController {

    private final EmployeService employeService;

    @PostMapping
    public Page<EmployeDto> allEmployees(@RequestBody SearchDto searchDto){
        return employeService.findAll(searchDto);
    }

    @PostMapping("/create")
    public ResponseEntity<EmployeDto> create(@RequestBody @Valid EmployeDto employeDto){
        return ResponseEntity.ok(employeService.create(employeDto));
    }

    @PutMapping("/update")
    public ResponseEntity<EmployeDto> update(@RequestBody @Valid  EmployeDto employeDto){
        return ResponseEntity.ok(employeService.update(employeDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeDto> findById(@PathVariable Long id){
        return ResponseEntity.ok(employeService.findById(id));
    }

}
