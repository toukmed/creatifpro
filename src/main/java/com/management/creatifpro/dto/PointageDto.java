package com.management.creatifpro.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.List;

@Builder
public record PointageDto(

        @NotNull(message = "L'id pointage est obligatoire")
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
        List<JourPointageDto> pointages
) implements GenericDto { }
