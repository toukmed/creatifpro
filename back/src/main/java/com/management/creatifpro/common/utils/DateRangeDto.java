package com.management.creatifpro.common.utils;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record DateRangeDto(
        LocalDate start,
        LocalDate end

) {
}
