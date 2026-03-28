package com.management.creatifpro.factures.models.dtos;

import com.management.creatifpro.factures.models.enums.EtatPaiement;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record FactureRequestDto(
        Long id,
        String numFacture,
        String nBc,
        String montantTtc,
        Long projectId,
        LocalDate dateFacture,
        EtatPaiement etatPaiement,
        LocalDate datePaiement) { }

