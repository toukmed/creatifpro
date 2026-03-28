package com.management.creatifpro.stock.mappers;

import com.management.creatifpro.stock.models.dtos.EntreeStockRequestDto;
import com.management.creatifpro.stock.models.dtos.EntreeStockResponseDto;
import com.management.creatifpro.stock.models.entities.EntreeStockEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EntreeStockMapper {

    public EntreeStockResponseDto toDto(EntreeStockEntity entity) {
        return EntreeStockResponseDto
                .builder()
                .id(entity.getId())
                .nomComplet(entity.getNomComplet())
                .nomProduit(entity.getNomProduit())
                .typeProduit(entity.getTypeProduit())
                .uniteProduit(entity.getUniteProduit())
                .poids(entity.getPoids())
                .quantite(entity.getQuantite())
                .build();
    }

    public EntreeStockEntity toEntity(EntreeStockRequestDto dto) {
        return EntreeStockEntity
                .builder()
                .id(dto.id())
                .nomComplet(dto.nomComplet())
                .nomProduit(dto.nomProduit())
                .typeProduit(dto.typeProduit())
                .uniteProduit(dto.uniteProduit())
                .poids(dto.poids())
                .quantite(dto.quantite())
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
