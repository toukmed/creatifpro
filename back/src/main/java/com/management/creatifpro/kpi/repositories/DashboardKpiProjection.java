package com.management.creatifpro.kpi.repositories;

public interface DashboardKpiProjection {

    Double getTotalHeures();
    Double getTotalHeuresPayees();
    Double getTotalHeuresNonPayees();
    Long getNombrePointages();
    Long getNombreEmployesActifs();
    Double getMoyenneHeuresParEmploye();
    Double getTauxHeuresPayees();
}