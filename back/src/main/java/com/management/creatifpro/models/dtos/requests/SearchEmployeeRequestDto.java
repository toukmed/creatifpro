package com.management.creatifpro.models.dtos.requests;

import com.management.creatifpro.models.dtos.requests.utils.SortDto;
import com.management.creatifpro.models.enums.ContractType;
import lombok.Builder;

import java.util.Optional;

@Builder
public record SearchEmployeeRequestDto(
        Optional<String> label,
        Optional<ContractType> contractType,
        Optional<String> project,
        Optional<Integer> pageIndex,
        Optional<Integer> pageSize,
        Optional<SortDto> sort) {
}
