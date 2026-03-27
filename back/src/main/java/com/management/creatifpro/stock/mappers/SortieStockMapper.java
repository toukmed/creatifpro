package com.management.creatifpro.stock.mappers;

import com.management.creatifpro.stock.models.dtos.SortieStockRequestDto;
import com.management.creatifpro.stock.models.dtos.SortieStockResponseDto;
import com.management.creatifpro.stock.models.entities.SortieStockEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SortieStockMapper {

    public SortieStockResponseDto toDto(SortieStockEntity entity) {
        return SortieStockResponseDto
                .builder()
                .id(entity.getId())
                .nomComplet(entity.getNomComplet())
                .nomProduit(entity.getNomProduit())
                .typeProduit(entity.getTypeProduit())
                .uniteProduit(entity.getUniteProduit())
                .poids(entity.getPoids())
                .quantite(entity.getQuantite())
                .chantier(entity.getChantier())
                .build();
    }

    public SortieStockEntity toEntity(SortieStockRequestDto dto) {
        return SortieStockEntity
                .builder()
                .id(dto.id())
                .nomComplet(dto.nomComplet())
                .nomProduit(dto.nomProduit())
                .typeProduit(dto.typeProduit())
                .uniteProduit(dto.uniteProduit())
                .poids(dto.poids())
                .quantite(dto.quantite())
                .chantier(dto.chantier())
                .build();
    }

    public List<SortieStockResponseDto> toDtoList(List<SortieStockEntity> entities) {
        if (entities == null) return List.of();
        return entities
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
