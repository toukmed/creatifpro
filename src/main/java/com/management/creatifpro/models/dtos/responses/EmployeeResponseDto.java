package com.management.creatifpro.models.dtos.responses;

import com.management.creatifpro.models.enums.ContractType;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record EmployeeResponseDto(

        Long id,
        String firstName,
        String lastName,
        String cin,
        String phoneNumber,
        ContractType contractType,
        String jobRole,
        LocalDate dateIntegration,
        Float hourlyRate,
        Float salary
        ) { }
