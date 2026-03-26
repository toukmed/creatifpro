package com.management.creatifpro.projects.models.dtos;

import lombok.Builder;

@Builder
public record ProjectResponseDto(
        Long id,
        String code,
        String reference) { }
