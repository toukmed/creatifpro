package com.management.creatifpro.stock.models.dtos;

import lombok.Builder;

@Builder
public record EtatStockDto(
        ProduitResponseDto produit,
        Double totalEntrees,
        Double totalSorties,
        Double stockDisponible,
        Double valeurStock,
        Double seuilAlerte,
        Boolean enAlerte
) {}

