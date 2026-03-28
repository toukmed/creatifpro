package com.management.creatifpro.materiels.models.dtos;

import lombok.Builder;

@Builder
public record MaterielRequestDto(
        Long id,
        String nom,
        String reference,
        String chantier) { }
