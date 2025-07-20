package com.management.creatifpro.models.dtos.requests;

import com.management.creatifpro.models.dtos.requests.utils.DateRangeDto;
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
