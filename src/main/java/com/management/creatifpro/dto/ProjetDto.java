package com.management.creatifpro.dto;

import com.management.creatifpro.entity.EmployeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
public record ProjetDto(
        Long id,
        @NotBlank
        String nom,
        @NotBlank
        String reference) { }
