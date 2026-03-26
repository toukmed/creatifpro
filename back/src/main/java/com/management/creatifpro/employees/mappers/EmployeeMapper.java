package com.management.creatifpro.employees.mappers;

import com.management.creatifpro.employees.models.dtos.EmployeeResponseDto;
import com.management.creatifpro.employees.models.entities.EmployeeEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class EmployeeMapper {

    public EmployeeResponseDto toDto(EmployeeEntity entity) {
        return EmployeeResponseDto
                .builder()
                .id(entity.getId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .cin(entity.getCin())
                .phoneNumber(entity.getPhoneNumber())
                .dateIntegration(entity.getIntegrationDate())
                .hourlyRate(entity.getHourlyRate())
                .jobRole(entity.getJobRole())
                .salary(entity.getSalary())
                .build();
    }

    public List<EmployeeResponseDto> toDtoList(List<EmployeeEntity> entities){
        if(entities == null) return List.of();
        return entities
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Page<EmployeeResponseDto> toDtoPage(Page<EmployeeEntity> entitiesPage, Pageable pageable){
        return new PageImpl<>(toDtoList(entitiesPage.getContent()), pageable, entitiesPage.getTotalElements());
    }

}
