package com.management.creatifpro.mapper;

import com.management.creatifpro.dto.PointageDto;
import com.management.creatifpro.entity.JourPointageEntity;
import com.management.creatifpro.entity.PointageEntity;
import com.management.creatifpro.exception.AppException;
import com.management.creatifpro.mapper.generic.GenericMapper;
import com.management.creatifpro.repository.EmployeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PointageMapper extends GenericMapper<PointageDto, PointageEntity> {

    private final EmployeMapper employeMapper;
    private final JourPointageMapper jourPointageMapper;
    private final EmployeRepository employeRepository;

    @Override
    public PointageDto toDto(PointageEntity entity) {
        return PointageDto
                .builder()
                .id(entity.getId())
                .employe(employeMapper.toMinimalDto(entity.getEmploye()))
                .build();
    }

    private JourPointageEntity filterJourPointage(List<JourPointageEntity> pointages, DayOfWeek day){
        List<JourPointageEntity> filteredList = !pointages.isEmpty() ?
                pointages.stream()
                .filter(jourPointageEntity -> jourPointageEntity.getJourPointage().getDayOfWeek().equals(day))
                .toList() : null;
        return filteredList != null && !filteredList.isEmpty() ? filteredList.get(0) : null;
    }

    @Override
    public PointageEntity toEntity(PointageDto entityDto) {
        return PointageEntity
                .builder()
                .employe(employeRepository
                        .findById(entityDto.employe().id())
                        .orElseThrow(() -> new AppException("Employe with id: " + entityDto.employe().id() + " not found", HttpStatus.NOT_FOUND)))
                .pointages(jourPointageMapper.toEntityList(entityDto.pointages()))
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
}
