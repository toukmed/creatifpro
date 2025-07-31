package com.management.creatifpro.controllers;

import com.management.creatifpro.models.dtos.responses.ProjectResponseDto;
import com.management.creatifpro.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.management.creatifpro.utils.Resource.PROJECT.PROJECTS;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping(PROJECTS)
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<List<ProjectResponseDto>> findAll() {
        return ok(projectService.findAll());
    }
}
