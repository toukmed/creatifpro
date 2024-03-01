package com.management.creatifpro.mapper;

import com.management.creatifpro.dto.JourPointageDto;
import com.management.creatifpro.entity.JourPointageEntity;
import com.management.creatifpro.exception.AppException;
import com.management.creatifpro.mapper.generic.GenericMapper;
import com.management.creatifpro.repository.ProjetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class JourPointageMapper extends GenericMapper<JourPointageDto, JourPointageEntity> {

    private final ProjetMapper projetMapper;
    private final ProjetRepository projetRepository;

    @Override
    public JourPointageDto toDto(JourPointageEntity entity) {
        return JourPointageDto
                .builder()
                .id(entity.getId())
                .jourPointage(entity.getJourPointage().format(DATE_FORMATTER))
                .pointage(entity.getPointage())
                .pointageSupplementaire(entity.getPointageSupplementaire())
                .projet(projetMapper
                        .toDto(projetRepository
                                .findById(entity.getProjetId())
                                .orElseThrow(() -> new AppException("Projet with id: " + entity.getProjetId() + " not found", HttpStatus.NOT_FOUND))))
                .build();
    }

    @Override
    public JourPointageEntity toEntity(JourPointageDto entityDto) {
        if (entityDto.projet() != null) {
            if (projetRepository.existsById(entityDto.projet().id())) {
                return JourPointageEntity
                        .builder()
                        .jourPointage(LocalDate.parse(entityDto.jourPointage(), DATE_FORMATTER))
                        .pointage(entityDto.pointage())
                        .pointageSupplementaire(entityDto.pointageSupplementaire())
                        .projetId(entityDto.projet().id())
                        .build();
            } else {
                throw new AppException("Projet with id: " + entityDto.projet().id() + " not found", HttpStatus.NOT_FOUND);
            }
        }
        throw new AppException("Projet is mandatory: ", HttpStatus.BAD_REQUEST);
    }

    @Override
    public JourPointageEntity toMinimalEntity(JourPointageDto entityDto) {
        return toEntity(entityDto);
    }
}
