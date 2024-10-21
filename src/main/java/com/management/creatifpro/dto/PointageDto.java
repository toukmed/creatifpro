package com.management.creatifpro.dto;

import jakarta.validation.Valid;
import lombok.Builder;

import java.time.LocalDate;
import java.util.List;

@Builder
public record PointageDto(

        Long id,
        EmployeMinimalDto employe,

        JourPointageDto lundi,
        JourPointageDto mardi,
        JourPointageDto mercredi,
        JourPointageDto jeudi,
        JourPointageDto vendredi,
        JourPointageDto samedi,
        JourPointageDto dimanche,
        @Valid
        List<JourPointageDto> pointages,

        String referenceProjet,
        LocalDate startDate,
        LocalDate endDate,
        Long totalHours,
        List<Long> employesIds


) implements GenericDto { }
