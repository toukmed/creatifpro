package com.management.creatifpro.kpi.repositories;

import com.management.creatifpro.pointage.models.entities.PointageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface KpiRepository extends JpaRepository<PointageEntity, Long> {

    @Query(value = """
    SELECT
        SUM(p.worked_days) AS totalJours,
        SUM(CASE WHEN p.is_paid = true THEN p.worked_days ELSE 0 END) AS totalJoursPayes,
        SUM(CASE WHEN p.is_paid = false THEN p.worked_days ELSE 0 END) AS totalJoursNonPayes,
        COUNT(p.id) AS nombrePointages,
        COUNT(DISTINCT p.employee_id) AS nombreEmployesActifs,
        SUM(p.worked_days) / COUNT(DISTINCT p.employee_id) AS moyenneJoursParEmploye,
        (SUM(CASE WHEN p.is_paid = true THEN p.worked_days ELSE 0 END) 
        / NULLIF(SUM(p.worked_days), 0)) * 100 AS tauxJoursPayes
    FROM pointages p
    WHERE p.pointage_date BETWEEN :startDate AND :endDate
    AND (:employeeId IS NULL OR p.employee_id = :employeeId)
    AND (:projectId IS NULL OR p.project_id = :projectId)
""", nativeQuery = true)
    DashboardKpiProjection getDashboardKpis(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("employeeId") Long employeeId,
            @Param("projectId") Long projectId
    );
}
