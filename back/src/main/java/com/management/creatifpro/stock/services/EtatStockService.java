package com.management.creatifpro.stock.services;

import com.management.creatifpro.stock.mappers.ProduitMapper;
import com.management.creatifpro.stock.models.dtos.EtatStockDto;
import com.management.creatifpro.stock.models.dtos.ProduitResponseDto;
import com.management.creatifpro.stock.models.entities.EntreeStockEntity;
import com.management.creatifpro.stock.models.entities.ProduitEntity;
import com.management.creatifpro.stock.repositories.EntreeStockRepository;
import com.management.creatifpro.stock.repositories.ProduitRepository;
import com.management.creatifpro.stock.repositories.SortieStockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EtatStockService {

    private final ProduitRepository produitRepository;
    private final EntreeStockRepository entreeStockRepository;
    private final SortieStockRepository sortieStockRepository;
    private final ProduitMapper produitMapper;

    public List<EtatStockDto> getEtatStock() {
        List<ProduitEntity> produits = produitRepository.findAll();

        return produits.stream().map(produit -> {
            Double totalEntrees = entreeStockRepository.sumQuantiteByProduitId(produit.getId());
            Double totalSorties = sortieStockRepository.sumQuantiteByProduitId(produit.getId());
            Double stockDisponible = totalEntrees - totalSorties;

            // Get latest unit price for valuation
            Double dernierPrixUnitaire = entreeStockRepository.findLatestByProduitId(produit.getId())
                    .stream()
                    .findFirst()
                    .map(EntreeStockEntity::getPrixUnitaire)
                    .orElse(0.0);

            Double valeurStock = stockDisponible * dernierPrixUnitaire;
            Double seuilAlerte = produit.getSeuilAlerte() != null ? produit.getSeuilAlerte() : 0.0;
            Boolean enAlerte = stockDisponible <= seuilAlerte;

            ProduitResponseDto produitDto = produitMapper.toDto(produit);

            return EtatStockDto.builder()
                    .produit(produitDto)
                    .totalEntrees(totalEntrees)
                    .totalSorties(totalSorties)
                    .stockDisponible(stockDisponible)
                    .valeurStock(valeurStock)
                    .seuilAlerte(seuilAlerte)
                    .enAlerte(enAlerte)
                    .build();
        }).collect(Collectors.toList());
    }
}

