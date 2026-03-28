package com.management.creatifpro.kpi.services;

import com.management.creatifpro.kpi.models.KpiRequestDto;
import com.management.creatifpro.kpi.models.KpiResponseDto;
import com.management.creatifpro.kpi.repositories.DashboardKpiResult;
import com.management.creatifpro.kpi.repositories.KpiQueryBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KpiService {

    private final KpiQueryBuilder kpiQueryBuilder;

    public KpiResponseDto getDashboardKpis(KpiRequestDto request) {
        log.info("Search Kpi request: startDate={}, endDate={}, employeeId={}, projectId={}",
                request.startDate(), request.endDate(), request.employeeId(), request.projectId());

        DashboardKpiResult kpis = kpiQueryBuilder.getDashboardKpis(request);

        return KpiResponseDto.builder()
                .getTotalJours(kpis.getTotalJours())
                .getNombrePointages(kpis.getNombrePointages())
                .getTauxJoursPayes(kpis.getTauxJoursPayes())
                .getTotalJoursPayes(kpis.getTotalJoursPayes())
                .getTotalJoursNonPayes(kpis.getTotalJoursNonPayes())
                .getNombreEmployesActifs(kpis.getNombreEmployesActifs())
                .getMoyenneJoursParEmploye(kpis.getMoyenneJoursParEmploye())
                .build();
    }
}
