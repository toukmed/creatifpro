package com.management.creatifpro.services;

import com.management.creatifpro.mappers.ProjectMapper;
import com.management.creatifpro.models.dtos.responses.ProjectResponseDto;
import com.management.creatifpro.repositories.ProjectRepository;
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
