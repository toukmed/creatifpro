package com.management.creatifpro.pointage.models.dtos;

import com.management.creatifpro.employees.models.dtos.EmployeeResponseDto;
import com.management.creatifpro.projects.models.dtos.ProjectResponseDto;
import lombok.Builder;

@Builder
public record PointageResponseDto(

        Long id,
        ProjectResponseDto project,
        EmployeeResponseDto employee,
        String pointageDate,
        Float totalHours,
        String comment,
        Boolean isPaid


) {
}
