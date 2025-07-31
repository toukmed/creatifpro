package com.management.creatifpro.models.dtos.requests;

import com.management.creatifpro.models.dtos.requests.utils.SortDto;
import com.management.creatifpro.models.enums.ContractType;
import lombok.Builder;

import java.time.LocalDate;
import java.util.Optional;

@Builder
public record SearchPointageRequestDto(
        Optional<String> label,
        Optional<ContractType> contractType,
        Optional<String> project,
        Optional<LocalDate> startDate,
        Optional<LocalDate> endDate,
        Optional<Integer> pageIndex,
        Optional<Integer> pageSize,
        Optional<SortDto> sort) {
}
