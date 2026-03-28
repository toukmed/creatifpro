package com.management.creatifpro.stock.models.dtos;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record SortieStockRequestDto(
        Long id,
        Long produitId,
        Double quantite,
        Long projectId,
        LocalDate dateSortie,
        String demandeur,
        String referenceDocument,
        String commentaire
) {}
