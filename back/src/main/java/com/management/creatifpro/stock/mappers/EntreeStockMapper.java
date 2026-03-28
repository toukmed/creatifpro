package com.management.creatifpro.stock.mappers;

import com.management.creatifpro.stock.models.dtos.EntreeStockRequestDto;
import com.management.creatifpro.stock.models.dtos.EntreeStockResponseDto;
import com.management.creatifpro.stock.models.entities.EntreeStockEntity;
import com.management.creatifpro.stock.models.entities.ProduitEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EntreeStockMapper {

    private final ProduitMapper produitMapper;

    public EntreeStockResponseDto toDto(EntreeStockEntity entity) {
        return EntreeStockResponseDto
                .builder()
                .id(entity.getId())
                .produit(produitMapper.toDto(entity.getProduit()))
                .quantite(entity.getQuantite())
                .prixUnitaire(entity.getPrixUnitaire())
                .fournisseur(entity.getFournisseur())
                .dateEntree(entity.getDateEntree())
                .referenceDocument(entity.getReferenceDocument())
                .commentaire(entity.getCommentaire())
                .build();
    }

    public EntreeStockEntity toEntity(EntreeStockRequestDto dto, ProduitEntity produit) {
        return EntreeStockEntity
                .builder()
                .id(dto.id())
                .produit(produit)
                .quantite(dto.quantite())
                .prixUnitaire(dto.prixUnitaire())
                .fournisseur(dto.fournisseur())
                .dateEntree(dto.dateEntree())
                .referenceDocument(dto.referenceDocument())
                .commentaire(dto.commentaire())
                .build();
    }

    public List<EntreeStockResponseDto> toDtoList(List<EntreeStockEntity> entities) {
        if (entities == null) return List.of();
        return entities
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
