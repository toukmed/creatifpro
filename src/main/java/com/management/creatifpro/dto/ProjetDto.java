package com.management.creatifpro.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record ProjetDto(
        Long id,
        @NotBlank
        String nom,
        @NotBlank
        String reference) implements GenericDto { }
