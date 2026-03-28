package com.management.creatifpro.stock.services;

import com.management.creatifpro.common.exceptions.AppException;
import com.management.creatifpro.stock.mappers.EntreeStockMapper;
import com.management.creatifpro.stock.models.dtos.EntreeStockRequestDto;
import com.management.creatifpro.stock.models.dtos.EntreeStockResponseDto;
import com.management.creatifpro.stock.models.entities.EntreeStockEntity;
import com.management.creatifpro.stock.models.entities.ProduitEntity;
import com.management.creatifpro.stock.repositories.EntreeStockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EntreeStockService {

    private final EntreeStockRepository entreeStockRepository;
    private final EntreeStockMapper entreeStockMapper;
    private final ProduitService produitService;

    public List<EntreeStockResponseDto> findAll() {
        return entreeStockMapper.toDtoList(entreeStockRepository.findAll());
    }

    public EntreeStockResponseDto getById(Long id) {
        EntreeStockEntity entity = entreeStockRepository.findById(id)
                .orElseThrow(() -> new AppException("Entrée stock non trouvée avec l'id: " + id, HttpStatus.NOT_FOUND));
        return entreeStockMapper.toDto(entity);
    }

    public EntreeStockResponseDto create(EntreeStockRequestDto dto) {
        log.info("Creating entree stock for produit id: {}", dto.produitId());
        ProduitEntity produit = produitService.findProduitById(dto.produitId());
        EntreeStockEntity entity = entreeStockMapper.toEntity(dto, produit);
        EntreeStockEntity saved = entreeStockRepository.save(entity);
        return entreeStockMapper.toDto(saved);
    }

    public EntreeStockResponseDto update(EntreeStockRequestDto dto) {
        EntreeStockEntity entity = entreeStockRepository.findById(dto.id())
                .orElseThrow(() -> new AppException("Entrée stock non trouvée avec l'id: " + dto.id(), HttpStatus.NOT_FOUND));
        ProduitEntity produit = produitService.findProduitById(dto.produitId());
        entity.setProduit(produit);
        entity.setQuantite(dto.quantite());
        entity.setPrixUnitaire(dto.prixUnitaire());
        entity.setFournisseur(dto.fournisseur());
        entity.setDateEntree(dto.dateEntree());
        entity.setReferenceDocument(dto.referenceDocument());
        entity.setCommentaire(dto.commentaire());
        EntreeStockEntity saved = entreeStockRepository.save(entity);
        return entreeStockMapper.toDto(saved);
    }

    public void delete(Long id) {
        if (!entreeStockRepository.existsById(id)) {
            throw new AppException("Entrée stock non trouvée avec l'id: " + id, HttpStatus.NOT_FOUND);
        }
        entreeStockRepository.deleteById(id);
    }
}
