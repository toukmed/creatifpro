package com.management.creatifpro.stock.mappers;

import com.management.creatifpro.projects.mappers.ProjectMapper;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import com.management.creatifpro.stock.models.dtos.SortieStockRequestDto;
import com.management.creatifpro.stock.models.dtos.SortieStockResponseDto;
import com.management.creatifpro.stock.models.entities.ProduitEntity;
import com.management.creatifpro.stock.models.entities.SortieStockEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SortieStockMapper {

    private final ProduitMapper produitMapper;
    private final ProjectMapper projectMapper;

    public SortieStockResponseDto toDto(SortieStockEntity entity) {
        return SortieStockResponseDto
                .builder()
                .id(entity.getId())
                .produit(produitMapper.toDto(entity.getProduit()))
                .quantite(entity.getQuantite())
                .project(entity.getProject() != null ? projectMapper.toDto(entity.getProject()) : null)
                .dateSortie(entity.getDateSortie())
                .demandeur(entity.getDemandeur())
                .referenceDocument(entity.getReferenceDocument())
                .commentaire(entity.getCommentaire())
                .build();
    }

    public SortieStockEntity toEntity(SortieStockRequestDto dto, ProduitEntity produit, ProjectEntity project) {
        return SortieStockEntity
                .builder()
                .id(dto.id())
                .produit(produit)
                .quantite(dto.quantite())
                .project(project)
                .dateSortie(dto.dateSortie())
                .demandeur(dto.demandeur())
                .referenceDocument(dto.referenceDocument())
                .commentaire(dto.commentaire())
                .build();
    }

    public List<SortieStockResponseDto> toDtoList(List<SortieStockEntity> entities) {
        if (entities == null) return List.of();
        return entities
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
