package com.management.creatifpro.dto;

import lombok.Builder;

@Builder
public record EmployeMinimalDto(
        Long id,
        String nom,
        String prenom
        ) implements GenericDto { }
