package com.management.creatifpro.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.List;

@Builder
public record PointageDto(
        Long id,
        @NotNull(message = "Employé auquel le pointage sera affecté est obligatoire")
        EmployeDto employe,
        Long datePointage,
        Float totalJoursTravailles,
        Float totalJoursSupTravailles,
        @Valid
        List<JourPointageDto> pointages
) { }
