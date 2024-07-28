package com.management.creatifpro.mapper;

import com.management.creatifpro.dto.JourPointageDto;
import com.management.creatifpro.entity.JourPointageEntity;
import com.management.creatifpro.mapper.generic.GenericMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class JourPointageMapper extends GenericMapper<JourPointageDto, JourPointageEntity> {

    @Override
    public JourPointageDto toDto(JourPointageEntity entity) {
        return entity != null ? JourPointageDto
                .builder()
                .id(entity.getId())
                .jourPointage(entity.getJourPointage().format(DATE_FORMATTER))
                .pointage(entity.getPointage())
                .build() : null;
    }

    @Override
    public JourPointageEntity toEntity(JourPointageDto entityDto) {
        return JourPointageEntity
                .builder()
                .jourPointage(LocalDate.parse(entityDto.jourPointage(), DATE_FORMATTER))
                .pointage(entityDto.pointage())
                .build();
    }

    @Override
    public JourPointageEntity toMinimalEntity(JourPointageDto entityDto) {
        return toEntity(entityDto);
    }
}
