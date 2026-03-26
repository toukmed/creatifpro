package com.management.creatifpro.kpi.repositories;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardKpiResult {
    private Double totalHeures;
    private Double totalHeuresPayees;
    private Double totalHeuresNonPayees;
    private Long nombrePointages;
    private Long nombreEmployesActifs;
    private Double moyenneHeuresParEmploye;
    private Double tauxHeuresPayees;
}

