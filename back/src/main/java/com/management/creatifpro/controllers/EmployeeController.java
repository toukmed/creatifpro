package com.management.creatifpro.controllers;

import com.management.creatifpro.models.dtos.requests.SearchEmployeeRequestDto;
import com.management.creatifpro.models.dtos.responses.EmployeeResponseDto;
import com.management.creatifpro.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.management.creatifpro.utils.Resource.PROJECT.EMPLOYEES;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping(EMPLOYEES)
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    public ResponseEntity<Page<EmployeeResponseDto>> search(@RequestBody SearchEmployeeRequestDto dto) {
        return ok(employeeService.search(dto));
    }
}
