package com.management.creatifpro.pointage.models.dtos;

import com.management.creatifpro.employees.models.dtos.EmployeeRequestDto;
import com.management.creatifpro.projects.models.dtos.ProjectRequestDto;
import jakarta.validation.constraints.Max;
import lombok.Builder;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;

@Builder
public record UpdatePointageRequestDto(

        Long id,
        ProjectRequestDto project,
        EmployeeRequestDto employee,
        LocalDate pointageDate,
        @Max(12)
        Float totalHours,
        @Length(max = 100)
        String comment
) {
}
