package com.management.creatifpro.employees.models.dtos;

import com.management.creatifpro.projects.models.dtos.ProjectResponseDto;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record EmployeeResponseDto(

        Long id,
        String firstName,
        String lastName,
        String cin,
        String phoneNumber,
        String jobRole,
        LocalDate dateIntegration,
        Float hourlyRate,
        Float salary,
        String chantier,
        String nCnss,
        String rib,
        ProjectResponseDto project
        ) { }
