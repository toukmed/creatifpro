package com.management.creatifpro.mapper;

import com.management.creatifpro.dto.PointageDto;
import com.management.creatifpro.dto.ProjetDto;
import com.management.creatifpro.entity.PointageEntity;
import com.management.creatifpro.entity.ProjetEntity;
import com.management.creatifpro.mapper.generic.GenericMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProjetMapper extends GenericMapper<ProjetDto, ProjetEntity> {

    @Override
    public ProjetDto toDto(ProjetEntity entity) {
        return ProjetDto
                .builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .reference(entity.getReference())
                .build();
    }

    @Override
    public ProjetEntity toEntity(ProjetDto entityDto) {
        return ProjetEntity.builder()
                .nom(entityDto.nom())
                .reference(entityDto.reference())
                .build();
    }
}
