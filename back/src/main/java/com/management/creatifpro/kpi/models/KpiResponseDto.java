package com.management.creatifpro.kpi.models;

import lombok.Builder;

@Builder
public record KpiResponseDto(
        Double getTotalJours,
        Double getTotalJoursPayes,
        Double getTotalJoursNonPayes,
        Long getNombrePointages,
        Long getNombreEmployesActifs,
        Double getMoyenneJoursParEmploye,
        Double getTauxJoursPayes) {
}
