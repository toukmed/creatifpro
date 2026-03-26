package com.management.creatifpro.kpi.models;

import lombok.Builder;

@Builder
public record KpiResponseDto(
        Double getTotalHeures,
        Double getTotalHeuresPayees,
        Double getTotalHeuresNonPayees,
        Long getNombrePointages,
        Long getNombreEmployesActifs,
        Double getMoyenneHeuresParEmploye,
        Double getTauxHeuresPayees) {
}
