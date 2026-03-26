package com.management.creatifpro.projects.controllers;

import com.management.creatifpro.projects.models.dtos.ProjectResponseDto;
import com.management.creatifpro.projects.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<List<ProjectResponseDto>> findAll() {
        return ok(projectService.findAll());
    }
}
