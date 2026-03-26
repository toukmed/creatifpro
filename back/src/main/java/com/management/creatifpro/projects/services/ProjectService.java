package com.management.creatifpro.projects.services;

import com.management.creatifpro.projects.mappers.ProjectMapper;
import com.management.creatifpro.projects.models.dtos.ProjectResponseDto;
import com.management.creatifpro.projects.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    public List<ProjectResponseDto> findAll(){
        return projectMapper.toDtoList(projectRepository.findAll());
    }
}
