package com.management.creatifpro.employees.models.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record EmployeeRequestDto(

        Long id,
        @NotBlank(message = "Le prénom est requis")
        String firstName,
        @NotBlank(message = "Le nom est requis")
        String lastName,
        @NotBlank(message = "Le CIN est requis")
        String cin,
        String phoneNumber,
        String jobRole,
        LocalDate dateIntegration,
        Float hourlyRate,
        Float salary,
        Long projectId
        ) { }
