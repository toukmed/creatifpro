package com.management.creatifpro.stock.mappers;

import com.management.creatifpro.stock.models.dtos.ProduitRequestDto;
import com.management.creatifpro.stock.models.dtos.ProduitResponseDto;
import com.management.creatifpro.stock.models.entities.ProduitEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProduitMapper {

    public ProduitResponseDto toDto(ProduitEntity entity) {
        return ProduitResponseDto
                .builder()
                .id(entity.getId())
                .nomProduit(entity.getNomProduit())
                .typeProduit(entity.getTypeProduit())
                .uniteProduit(entity.getUniteProduit())
                .seuilAlerte(entity.getSeuilAlerte())
                .description(entity.getDescription())
                .build();
    }

    public ProduitEntity toEntity(ProduitRequestDto dto) {
        return ProduitEntity
                .builder()
                .id(dto.id())
                .nomProduit(dto.nomProduit())
                .typeProduit(dto.typeProduit())
                .uniteProduit(dto.uniteProduit())
                .seuilAlerte(dto.seuilAlerte())
                .description(dto.description())
                .build();
    }

    public List<ProduitResponseDto> toDtoList(List<ProduitEntity> entities) {
        if (entities == null) return List.of();
        return entities
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}

