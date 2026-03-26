package com.management.creatifpro.kpi.controllers;

import com.management.creatifpro.kpi.models.KpiRequestDto;
import com.management.creatifpro.kpi.models.KpiResponseDto;
import com.management.creatifpro.kpi.services.KpiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/kpi")
public class KpiController {

    private final KpiService kpiService;

    @PostMapping
    public ResponseEntity<KpiResponseDto> getDashboardKpi(@RequestBody KpiRequestDto request) {
        return ok(kpiService.getDashboardKpis(request));
    }

}
