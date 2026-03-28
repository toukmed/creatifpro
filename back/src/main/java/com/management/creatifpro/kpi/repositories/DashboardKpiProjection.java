package com.management.creatifpro.kpi.repositories;

public interface DashboardKpiProjection {

    Double getTotalJours();
    Double getTotalJoursPayes();
    Double getTotalJoursNonPayes();
    Long getNombrePointages();
    Long getNombreEmployesActifs();
    Double getMoyenneJoursParEmploye();
    Double getTauxJoursPayes();
}