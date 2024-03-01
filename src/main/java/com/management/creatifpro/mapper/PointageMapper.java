package com.management.creatifpro.mapper;

import com.management.creatifpro.dto.PointageDto;
import com.management.creatifpro.entity.JourPointageEntity;
import com.management.creatifpro.entity.PointageEntity;
import com.management.creatifpro.entity.SemainePointageEntity;
import com.management.creatifpro.exception.AppException;
import com.management.creatifpro.mapper.generic.GenericMapper;
import com.management.creatifpro.repository.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class PointageMapper extends GenericMapper<PointageDto, PointageEntity> {

    private final EmployeMapper employeMapper;
    private final JourPointageMapper jourPointageMapper;
    private final SemainePointageMapper semainePointageMapper;
    private final EmployeRepository employeRepository;

    @Override
    public PointageDto toDto(PointageEntity entity) {
        return PointageDto
                .builder()
                .id(entity.getId())
                .employe(employeMapper.toDto(entity.getEmploye()))
                .pointages(semainePointageMapper.toDtoList(entity.getPointages()))
                .totalJoursTravailles(totalJoursTravailles(entity.getPointages()))
                .totalJoursSupTravailles(totalJoursSupTravailles(entity.getPointages()))
                .build();
    }

    @Override
    public PointageEntity toEntity(PointageDto entityDto) {
        return PointageEntity
                .builder()
                .employe(employeRepository
                        .findById(entityDto.employe().id())
                        .orElseThrow(() -> new AppException("Employe with id: " + entityDto.employe().id() + " not found", HttpStatus.NOT_FOUND)))
                .pointages(semainePointageMapper.toEntityList(entityDto.pointages()))
                .build();
    }

    @Override
    public PointageEntity toMinimalEntity(PointageDto entityDto) {
        return PointageEntity
                .builder()
                .employe(employeRepository
                        .findById(entityDto.employe().id())
                        .orElseThrow(() -> new AppException("Employe with id: " + entityDto.employe().id() + " not found", HttpStatus.NOT_FOUND)))
                .build();
    }

    private Float totalJoursTravailles(List<SemainePointageEntity> semainePointages) {
        Float joursTravailles = 0f;
        for (SemainePointageEntity semainePointage : semainePointages) {
            for (JourPointageEntity pointage : semainePointage.getPointages()) {
                joursTravailles += pointage.getPointage();
            }
        }
        return joursTravailles;
    }

    private Float totalJoursSupTravailles(List<SemainePointageEntity> semainePointages) {
        Float joursTravailles = 0f;
        for (SemainePointageEntity semainePointage : semainePointages) {
            for (JourPointageEntity pointage : semainePointage.getPointages()) {
                joursTravailles += pointage.getPointageSupplementaire() != null
                        ? pointage.getPointageSupplementaire() : 0;
            }
        }
        return joursTravailles;
    }
}
