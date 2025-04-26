package com.management.creatifpro.dto;

import jakarta.validation.Valid;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record PointageDto(

        Long id,
        EmployeMinimalDto employe,
        @Valid
        List<JourPointageDto> pointages,

        LocalDate startDate,
        LocalDate endDate,
        Long pointage,
        Boolean status,
        String commentaire,
        List<Long> employesIds


) implements GenericDto { }
