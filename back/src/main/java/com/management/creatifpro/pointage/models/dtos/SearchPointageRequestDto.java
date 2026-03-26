package com.management.creatifpro.pointage.models.dtos;

import com.management.creatifpro.common.utils.SortDto;
import lombok.Builder;

import java.time.LocalDate;
import java.util.Optional;

@Builder
public record SearchPointageRequestDto(
        Optional<Long> employeeId,
        Optional<String> label,
        Optional<LocalDate> startDate,
        Optional<LocalDate> endDate,
        Optional<String> project,
        Optional<Integer> pageIndex,
        Optional<Integer> pageSize,
        Optional<SortDto> sort) {
}
