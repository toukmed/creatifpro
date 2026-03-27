package com.management.creatifpro.projects.models.dtos;

import com.management.creatifpro.projects.models.enums.EtatProjet;
import lombok.Builder;

@Builder
public record ProjectResponseDto(
        Long id,
        String code,
        String reference,
        String client,
        String nBc,
        String designation,
        EtatProjet etatProjet) { }
