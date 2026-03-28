package com.management.creatifpro.stock.services;

import com.management.creatifpro.common.exceptions.AppException;
import com.management.creatifpro.stock.mappers.ProduitMapper;
import com.management.creatifpro.stock.models.dtos.ProduitRequestDto;
import com.management.creatifpro.stock.models.dtos.ProduitResponseDto;
import com.management.creatifpro.stock.models.entities.ProduitEntity;
import com.management.creatifpro.stock.repositories.ProduitRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final ProduitMapper produitMapper;

    public List<ProduitResponseDto> findAll() {
        return produitMapper.toDtoList(produitRepository.findAll());
    }

    public ProduitResponseDto getById(Long id) {
        ProduitEntity entity = findProduitById(id);
        return produitMapper.toDto(entity);
    }

    public ProduitResponseDto create(ProduitRequestDto dto) {
        log.info("Creating produit: {}", dto.nomProduit());

        if (produitRepository.existsByNomProduit(dto.nomProduit())) {
            throw new AppException("Un produit avec le nom '" + dto.nomProduit() + "' existe déjà", HttpStatus.CONFLICT);
        }

        ProduitEntity entity = produitMapper.toEntity(dto);
        ProduitEntity saved = produitRepository.save(entity);
        log.info("Produit created with id: {}", saved.getId());
        return produitMapper.toDto(saved);
    }

    public ProduitResponseDto update(ProduitRequestDto dto) {
        ProduitEntity entity = findProduitById(dto.id());
        entity.setNomProduit(dto.nomProduit());
        entity.setTypeProduit(dto.typeProduit());
        entity.setUniteProduit(dto.uniteProduit());
        entity.setSeuilAlerte(dto.seuilAlerte());
        entity.setDescription(dto.description());
        ProduitEntity saved = produitRepository.save(entity);
        return produitMapper.toDto(saved);
    }

    public void delete(Long id) {
        if (!produitRepository.existsById(id)) {
            throw new AppException("Produit non trouvé avec l'id: " + id, HttpStatus.NOT_FOUND);
        }
        produitRepository.deleteById(id);
    }

    public ProduitEntity findProduitById(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new AppException("Produit non trouvé avec l'id: " + id, HttpStatus.NOT_FOUND));
    }
}

