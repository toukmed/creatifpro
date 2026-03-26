package com.management.creatifpro.projects.mappers;

import com.management.creatifpro.projects.models.dtos.ProjectResponseDto;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ProjectMapper {

    public ProjectResponseDto toDto(ProjectEntity entity) {
        return ProjectResponseDto
                .builder()
                .id(entity.getId())
                .code(entity.getCode())
                .reference(entity.getReference())
                .build();
    }

    public List<ProjectResponseDto> toDtoList(List<ProjectEntity> entities){
        if(entities == null) return List.of();
        return entities
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
