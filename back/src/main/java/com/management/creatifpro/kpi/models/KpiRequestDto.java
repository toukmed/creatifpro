package com.management.creatifpro.kpi.models;

import java.time.LocalDate;

public record KpiRequestDto(
        LocalDate startDate,
        LocalDate endDate,
        Long employeeId,
        Long projectId) {
}
