package com.management.creatifpro.models.dtos.requests;

import com.management.creatifpro.models.enums.ContractType;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record EmployeeRequestDto(

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
