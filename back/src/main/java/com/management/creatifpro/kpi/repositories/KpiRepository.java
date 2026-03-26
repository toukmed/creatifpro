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
        SUM(p.total_hours) AS totalHeures,
        SUM(CASE WHEN p.is_paid = true THEN p.total_hours ELSE 0 END) AS totalHeuresPayees,
        SUM(CASE WHEN p.is_paid = false THEN p.total_hours ELSE 0 END) AS totalHeuresNonPayees,
        COUNT(p.id) AS nombrePointages,
        COUNT(DISTINCT p.employee_id) AS nombreEmployesActifs,
        SUM(p.total_hours) / COUNT(DISTINCT p.employee_id) AS moyenneHeuresParEmploye,
        (SUM(CASE WHEN p.is_paid = true THEN p.total_hours ELSE 0 END) 
        / NULLIF(SUM(p.total_hours), 0)) * 100 AS tauxHeuresPayees
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
