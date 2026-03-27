package com.management.creatifpro.materiels.mappers;

import com.management.creatifpro.materiels.models.dtos.MaterielRequestDto;
import com.management.creatifpro.materiels.models.dtos.MaterielResponseDto;
import com.management.creatifpro.materiels.models.entities.MaterielEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class MaterielMapper {

    public MaterielResponseDto toDto(MaterielEntity entity) {
        return MaterielResponseDto
                .builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .reference(entity.getReference())
                .chantier(entity.getChantier())
                .build();
    }

    public MaterielEntity toEntity(MaterielRequestDto dto) {
        return MaterielEntity
                .builder()
                .id(dto.id())
                .nom(dto.nom())
                .reference(dto.reference())
                .chantier(dto.chantier())
                .build();
    }

    public List<MaterielResponseDto> toDtoList(List<MaterielEntity> entities) {
        return entities.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
