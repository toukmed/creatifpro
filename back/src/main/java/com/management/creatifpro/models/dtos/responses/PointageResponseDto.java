package com.management.creatifpro.models.dtos.responses;

import lombok.Builder;

@Builder
public record PointageResponseDto(

        Long id,
        ProjectResponseDto project,
        EmployeeResponseDto employee,
        String pointageDate,
        Float totalHours,
        String comment


) {
}
