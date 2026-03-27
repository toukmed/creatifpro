package com.management.creatifpro.projects.controllers;

import com.management.creatifpro.projects.models.dtos.ProjectRequestDto;
import com.management.creatifpro.projects.models.dtos.ProjectResponseDto;
import com.management.creatifpro.projects.services.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponseDto> getById(@PathVariable Long id) {
        return ok(projectService.getById(id));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<ProjectResponseDto> create(@RequestBody ProjectRequestDto dto) {
        return ok(projectService.create(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @PutMapping("/update")
    public ResponseEntity<ProjectResponseDto> update(@RequestBody ProjectRequestDto dto) {
        return ok(projectService.update(dto));
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
