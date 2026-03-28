package com.management.creatifpro.kpi.repositories;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardKpiResult {
    private Double totalJours;
    private Double totalJoursPayes;
    private Double totalJoursNonPayes;
    private Long nombrePointages;
    private Long nombreEmployesActifs;
    private Double moyenneJoursParEmploye;
    private Double tauxJoursPayes;
}

