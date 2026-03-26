package com.management.creatifpro.employees.controllers;

import com.management.creatifpro.employees.models.dtos.EmployeeResponseDto;
import com.management.creatifpro.employees.models.dtos.SearchEmployeeRequestDto;
import com.management.creatifpro.employees.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
