package com.management.creatifpro.employees.models.dtos;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record EmployeeRequestDto(

        Long id,
        String firstName,
        String lastName,
        String cin,
        String phoneNumber,
        String jobRole,
        LocalDate dateIntegration,
        Float hourlyRate,
        Float salary
        ) { }
