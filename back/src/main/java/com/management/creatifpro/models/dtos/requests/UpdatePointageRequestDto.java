package com.management.creatifpro.models.dtos.requests;

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
