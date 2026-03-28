package com.management.creatifpro.stock.services;

import com.management.creatifpro.common.exceptions.AppException;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import com.management.creatifpro.projects.repositories.ProjectRepository;
import com.management.creatifpro.stock.mappers.SortieStockMapper;
import com.management.creatifpro.stock.models.dtos.SortieStockRequestDto;
import com.management.creatifpro.stock.models.dtos.SortieStockResponseDto;
import com.management.creatifpro.stock.models.entities.ProduitEntity;
import com.management.creatifpro.stock.models.entities.SortieStockEntity;
import com.management.creatifpro.stock.repositories.SortieStockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SortieStockService {

    private final SortieStockRepository sortieStockRepository;
    private final SortieStockMapper sortieStockMapper;
    private final ProduitService produitService;
    private final ProjectRepository projectRepository;

    public List<SortieStockResponseDto> findAll() {
        return sortieStockMapper.toDtoList(sortieStockRepository.findAll());
    }

    public SortieStockResponseDto getById(Long id) {
        SortieStockEntity entity = sortieStockRepository.findById(id)
                .orElseThrow(() -> new AppException("Sortie stock non trouvée avec l'id: " + id, HttpStatus.NOT_FOUND));
        return sortieStockMapper.toDto(entity);
    }

    public SortieStockResponseDto create(SortieStockRequestDto dto) {
        log.info("Creating sortie stock for produit id: {}", dto.produitId());
        ProduitEntity produit = produitService.findProduitById(dto.produitId());
        ProjectEntity project = resolveProject(dto.projectId());
        SortieStockEntity entity = sortieStockMapper.toEntity(dto, produit, project);
        SortieStockEntity saved = sortieStockRepository.save(entity);
        return sortieStockMapper.toDto(saved);
    }

    public SortieStockResponseDto update(SortieStockRequestDto dto) {
        SortieStockEntity entity = sortieStockRepository.findById(dto.id())
                .orElseThrow(() -> new AppException("Sortie stock non trouvée avec l'id: " + dto.id(), HttpStatus.NOT_FOUND));
        ProduitEntity produit = produitService.findProduitById(dto.produitId());
        ProjectEntity project = resolveProject(dto.projectId());
        entity.setProduit(produit);
        entity.setQuantite(dto.quantite());
        entity.setProject(project);
        entity.setDateSortie(dto.dateSortie());
        entity.setDemandeur(dto.demandeur());
        entity.setReferenceDocument(dto.referenceDocument());
        entity.setCommentaire(dto.commentaire());
        SortieStockEntity saved = sortieStockRepository.save(entity);
        return sortieStockMapper.toDto(saved);
    }

    public void delete(Long id) {
        if (!sortieStockRepository.existsById(id)) {
            throw new AppException("Sortie stock non trouvée avec l'id: " + id, HttpStatus.NOT_FOUND);
        }
        sortieStockRepository.deleteById(id);
    }

    private ProjectEntity resolveProject(Long projectId) {
        if (projectId == null) return null;
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new AppException("Projet non trouvé avec l'id: " + projectId, HttpStatus.NOT_FOUND));
    }
}
