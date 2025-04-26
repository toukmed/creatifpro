package com.management.creatifpro.dto;

import com.management.creatifpro.util.ContratEmploye;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record EmployeDto(
        Long id,
        @NotBlank(message = "Le nom de l'employé est obligatoire")
        String nom,
        @NotBlank(message = "Le prenom de l'employé est obligatoire")
        String prenom,
        @NotBlank(message = "Le cin de l'employé est obligatoire")
        String cin,
        String numeroTelephone,
        LocalDate dateIntegration,
        @NotNull
        ContratEmploye typeContrat,
        String poste,
        Long tarifJournalier,
        Long salaireMensuel,
        ProjetDto projet
        ) implements GenericDto { }
