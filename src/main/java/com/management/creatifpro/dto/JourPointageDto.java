package com.management.creatifpro.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record JourPointageDto(
        Long id,
        @NotNull
        Long jourPointage,

        @Max(value = 1, message = "Le pointage ne peux pas depassé 8H, equivalente à 1")
        @Min(value = 0, message = "La valeur minimale du pointage est 0")
        Float pointage,
        @Max(value = 1, message = "Le pointage supplementaire ne peux pas depassé 8H, equivalente à 1")
        @Min(value = 0, message = "La valeur minimale du pointage supplementaire est 0")
        Float pointageSupplementaire,
        @NotNull
        ProjetDto projet,
        Long pointageId
) {
}
