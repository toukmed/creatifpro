package com.management.creatifpro.dto;

import com.management.creatifpro.util.ContratEmploye;
import lombok.Builder;

@Builder
public record EmployeMinimalDto(
        Long id,
        String nom,
        String prenom,
        ProjetDto projet,
        ContratEmploye typeContrat,
        String poste,
        String numeroTelephone
        ) implements GenericDto { }
