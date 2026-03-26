package com.management.creatifpro.projects.models.dtos;

import lombok.Builder;

@Builder
public record ProjectRequestDto(
        Long id,
        String code,
        String reference) { }
