package com.management.creatifpro.models.dtos.requests;

import lombok.Builder;

@Builder
public record ProjectRequestDto(
        Long id,
        String code,
        String reference) { }
