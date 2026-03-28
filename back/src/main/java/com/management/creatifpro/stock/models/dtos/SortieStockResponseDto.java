package com.management.creatifpro.stock.models.dtos;

import com.management.creatifpro.projects.models.dtos.ProjectResponseDto;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record SortieStockResponseDto(
        Long id,
        ProduitResponseDto produit,
        Double quantite,
        ProjectResponseDto project,
        LocalDate dateSortie,
        String demandeur,
        String referenceDocument,
        String commentaire
) {}
