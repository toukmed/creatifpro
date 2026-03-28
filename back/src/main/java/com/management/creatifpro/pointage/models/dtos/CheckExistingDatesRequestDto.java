package com.management.creatifpro.pointage.models.dtos;

import java.time.LocalDate;
import java.util.List;

public record CheckExistingDatesRequestDto(
        List<Long> employeeIds,
        LocalDate start,
        LocalDate end
) {
}

