package com.management.creatifpro.projects.services;

import com.management.creatifpro.projects.mappers.ProjectMapper;
import com.management.creatifpro.projects.models.dtos.ProjectRequestDto;
import com.management.creatifpro.projects.models.dtos.ProjectResponseDto;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import com.management.creatifpro.projects.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    public List<ProjectResponseDto> findAll() {
        return projectMapper.toDtoList(projectRepository.findAll());
    }

    public ProjectResponseDto getById(Long id) {
        ProjectEntity entity = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id: " + id));
        return projectMapper.toDto(entity);
    }

    public ProjectResponseDto create(ProjectRequestDto dto) {
        ProjectEntity entity = projectMapper.toEntity(dto);
        ProjectEntity saved = projectRepository.save(entity);
        return projectMapper.toDto(saved);
    }

    public ProjectResponseDto update(ProjectRequestDto dto) {
        ProjectEntity entity = projectRepository.findById(dto.id())
                .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id: " + dto.id()));
        entity.setCode(dto.code());
        entity.setReference(dto.reference());
        ProjectEntity saved = projectRepository.save(entity);
        return projectMapper.toDto(saved);
    }

    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new RuntimeException("Projet non trouvé avec l'id: " + id);
        }
        projectRepository.deleteById(id);
    }
}
