package com.management.creatifpro.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Builder;

import java.util.Optional;

@Builder
public record JourPointageDto(
        Long id,
        String jourPointage,
        Optional<String> startDate,
        Optional<String> endDate,

        @Max(value = 12, message = "Le pointage ne peux pas depassé 12H")
        @Min(value = 0, message = "La valeur minimale du pointage est 0")
        Float pointage,
        boolean status,
        String commentaire,
        Long idPointage
) implements GenericDto { }
