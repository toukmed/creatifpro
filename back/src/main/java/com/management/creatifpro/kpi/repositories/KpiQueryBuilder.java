package com.management.creatifpro.kpi.repositories;

import com.management.creatifpro.kpi.models.KpiRequestDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class KpiQueryBuilder {

    private final EntityManager entityManager;

    public DashboardKpiResult getDashboardKpis(KpiRequestDto request) {
        StringBuilder sql = new StringBuilder();
        sql.append("""
            SELECT
                COALESCE(SUM(p.total_hours), 0) AS totalHeures,
                COALESCE(SUM(CASE WHEN p.is_paid = true THEN p.total_hours ELSE 0 END), 0) AS totalHeuresPayees,
                COALESCE(SUM(CASE WHEN p.is_paid = false THEN p.total_hours ELSE 0 END), 0) AS totalHeuresNonPayees,
                COUNT(p.id) AS nombrePointages,
                COUNT(DISTINCT p.employee_id) AS nombreEmployesActifs,
                COALESCE(SUM(p.total_hours) / NULLIF(COUNT(DISTINCT p.employee_id), 0), 0) AS moyenneHeuresParEmploye,
                COALESCE((SUM(CASE WHEN p.is_paid = true THEN p.total_hours ELSE 0 END)
                    / NULLIF(SUM(p.total_hours), 0)) * 100, 0) AS tauxHeuresPayees
            FROM pointages p
            WHERE p.pointage_date BETWEEN :startDate AND :endDate
            """);

        // Dynamically add filters based on non-null parameters
        if (request.employeeId() != null) {
            sql.append(" AND p.employee_id = :employeeId");
        }

        if (request.projectId() != null) {
            sql.append(" AND p.project_id = :projectId");
        }

        log.debug("Generated KPI query: {}", sql);

        Query query = entityManager.createNativeQuery(sql.toString());

        // Set required parameters
        query.setParameter("startDate", request.startDate());
        query.setParameter("endDate", request.endDate());

        // Set optional parameters only if they are not null
        if (request.employeeId() != null) {
            query.setParameter("employeeId", request.employeeId());
        }

        if (request.projectId() != null) {
            query.setParameter("projectId", request.projectId());
        }

        Object[] result = (Object[]) query.getSingleResult();

        return mapToResult(result);
    }

    private DashboardKpiResult mapToResult(Object[] row) {
        return DashboardKpiResult.builder()
                .totalHeures(toDouble(row[0]))
                .totalHeuresPayees(toDouble(row[1]))
                .totalHeuresNonPayees(toDouble(row[2]))
                .nombrePointages(toLong(row[3]))
                .nombreEmployesActifs(toLong(row[4]))
                .moyenneHeuresParEmploye(toDouble(row[5]))
                .tauxHeuresPayees(toDouble(row[6]))
                .build();
    }

    private Double toDouble(Object value) {
        if (value == null) {
            return 0.0;
        }
        double result;
        if (value instanceof BigDecimal) {
            result = ((BigDecimal) value).doubleValue();
        } else if (value instanceof Number) {
            result = ((Number) value).doubleValue();
        } else {
            return 0.0;
        }
        return Math.round(result * 100.0) / 100.0;
    }

    private Long toLong(Object value) {
        if (value == null) {
            return 0L;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return 0L;
    }
}



