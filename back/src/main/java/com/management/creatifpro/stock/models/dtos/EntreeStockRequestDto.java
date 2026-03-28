package com.management.creatifpro.stock.models.dtos;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record EntreeStockRequestDto(
        Long id,
        Long produitId,
        Double quantite,
        Double prixUnitaire,
        String fournisseur,
        LocalDate dateEntree,
        String referenceDocument,
        String commentaire
) {}
