package com.management.creatifpro.factures.mappers;

import com.management.creatifpro.factures.models.dtos.FactureRequestDto;
import com.management.creatifpro.factures.models.dtos.FactureResponseDto;
import com.management.creatifpro.factures.models.entities.FactureEntity;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import com.management.creatifpro.projects.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FactureMapper {

    private final ProjectRepository projectRepository;

    public FactureResponseDto toDto(FactureEntity entity) {
        return FactureResponseDto
                .builder()
                .id(entity.getId())
                .numFacture(entity.getNumFacture())
                .nBc(entity.getNBc())
                .montantTtc(entity.getMontantTtc())
                .projectId(entity.getProject() != null ? entity.getProject().getId() : null)
                .projectCode(entity.getProject() != null ? entity.getProject().getCode() : null)
                .dateFacture(entity.getDateFacture())
                .etatPaiement(entity.getEtatPaiement())
                .datePaiement(entity.getDatePaiement())
                .build();
    }

    public FactureEntity toEntity(FactureRequestDto dto) {
        ProjectEntity project = null;
        if (dto.projectId() != null) {
            project = projectRepository.findById(dto.projectId())
                    .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id: " + dto.projectId()));
        }
        return FactureEntity
                .builder()
                .id(dto.id())
                .numFacture(dto.numFacture())
                .nBc(dto.nBc())
                .montantTtc(dto.montantTtc())
                .project(project)
                .dateFacture(dto.dateFacture())
                .etatPaiement(dto.etatPaiement())
                .datePaiement(dto.datePaiement())
                .build();
    }

    public List<FactureResponseDto> toDtoList(List<FactureEntity> entities) {
        if (entities == null) return List.of();
        return entities
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}

