package com.management.creatifpro.employees.models.dtos;

import com.management.creatifpro.common.utils.SortDto;
import lombok.Builder;

import java.util.Optional;

@Builder
public record SearchEmployeeRequestDto(
        Optional<String> label,
        Optional<String> project,
        Optional<Integer> pageIndex,
        Optional<Integer> pageSize,
        Optional<SortDto> sort) {
}
