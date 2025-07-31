package com.management.creatifpro.models.dtos.requests.utils;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record DateRangeDto(
        LocalDate start,
        LocalDate end

) {
}
