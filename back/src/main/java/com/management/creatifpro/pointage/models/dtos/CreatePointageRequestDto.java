package com.management.creatifpro.pointage.models.dtos;

import com.management.creatifpro.employees.models.dtos.EmployeeRequestDto;
import com.management.creatifpro.common.utils.DateRangeDto;
import com.management.creatifpro.projects.models.dtos.ProjectRequestDto;
import jakarta.validation.constraints.Max;
import lombok.Builder;
import org.hibernate.validator.constraints.Length;

import java.util.List;

@Builder
public record CreatePointageRequestDto(

        Long id,
        ProjectRequestDto project,
        List<EmployeeRequestDto> employees,
        DateRangeDto pointageDateRange,
        @Max(12)
        Float totalHours,
        @Length(max = 100)
        String comment
) {
}
