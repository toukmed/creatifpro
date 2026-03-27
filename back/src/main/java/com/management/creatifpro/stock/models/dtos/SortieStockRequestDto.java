package com.management.creatifpro.stock.models.dtos;

import com.management.creatifpro.stock.models.enums.UniteProduit;
import lombok.Builder;

@Builder
public record SortieStockRequestDto(
        Long id,
        String nomComplet,
        String nomProduit,
        String typeProduit,
        UniteProduit uniteProduit,
        Double poids,
        Double quantite,
        String chantier
) {}
