package com.management.creatifpro.stock.models.dtos;

import com.management.creatifpro.stock.models.enums.TypeProduit;
import com.management.creatifpro.stock.models.enums.UniteProduit;
import lombok.Builder;

@Builder
public record ProduitRequestDto(
        Long id,
        String nomProduit,
        TypeProduit typeProduit,
        UniteProduit uniteProduit,
        Double seuilAlerte,
        String description
) {}

