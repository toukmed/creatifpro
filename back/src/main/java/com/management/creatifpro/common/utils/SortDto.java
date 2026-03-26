package com.management.creatifpro.common.utils;

import lombok.Builder;
import org.springframework.data.domain.Sort.Direction;

@Builder
public record SortDto(
        String property,
        Direction direction

) {
}
