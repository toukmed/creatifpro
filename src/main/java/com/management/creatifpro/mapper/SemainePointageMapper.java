package com.management.creatifpro.mapper;

import com.management.creatifpro.dto.SemainePointageDto;
import com.management.creatifpro.entity.SemainePointageEntity;
import com.management.creatifpro.mapper.generic.GenericMapper;
import com.management.creatifpro.repository.ProjetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class SemainePointageMapper extends GenericMapper<SemainePointageDto, SemainePointageEntity> {

    private final ProjetMapper projetMapper;
    private final ProjetRepository projetRepository;
    private final JourPointageMapper jourPointageMapper;

    @Override
    public SemainePointageDto toDto(SemainePointageEntity entity) {
        return SemainePointageDto
                .builder()
                .id(entity.getId())
                .dateDebutPointage(entity.getDateDebutPointage().format(DATE_FORMATTER))
                .dateFinPointage(entity.getDateFinPointage().format(DATE_FORMATTER))
                .jourPointages(jourPointageMapper.toDtoList(entity.getPointages()))
                .status(entity.isStatus())
                .build();
    }

    @Override
    public SemainePointageEntity toEntity(SemainePointageDto entityDto) {

        return SemainePointageEntity
                .builder()
                .dateDebutPointage(LocalDate.parse(entityDto.dateDebutPointage(), DATE_FORMATTER))
                .dateFinPointage(LocalDate.parse(entityDto.dateFinPointage(), DATE_FORMATTER))
                .status(entityDto.status())
                .pointages(jourPointageMapper.toEntityList(entityDto.jourPointages()))
                .build();
    }

    @Override
    public SemainePointageEntity toMinimalEntity(SemainePointageDto entityDto) {
        return SemainePointageEntity
                .builder()
                .dateDebutPointage(LocalDate.parse(entityDto.dateDebutPointage(), DATE_FORMATTER))
                .dateFinPointage(LocalDate.parse(entityDto.dateFinPointage(), DATE_FORMATTER))
                .status(entityDto.status())
                .build();
    }
}
