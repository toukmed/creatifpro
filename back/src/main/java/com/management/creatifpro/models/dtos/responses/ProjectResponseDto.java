package com.management.creatifpro.models.dtos.responses;

import lombok.Builder;

@Builder
public record ProjectResponseDto(
        Long id,
        String code,
        String reference) { }
