package com.management.creatifpro.dto;

import jakarta.validation.Valid;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record PointageStatsDto(

        Long id,
        EmployeMinimalDto employe,
        @Valid
        List<JourPointageDto> pointages,

        LocalDate startDate,
        LocalDate endDate,
        Long pointage,
        Boolean status,
        List<Long> employesIds


) implements GenericDto { }
