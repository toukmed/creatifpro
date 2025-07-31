package com.management.creatifpro.models.dtos.requests.utils;

import lombok.Builder;
import org.springframework.data.domain.Sort.Direction;

@Builder
public record SortDto(
        String property,
        Direction direction

) {
}
