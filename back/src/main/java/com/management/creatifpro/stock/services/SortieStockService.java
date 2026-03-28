package com.management.creatifpro.stock.services;

import com.management.creatifpro.stock.mappers.SortieStockMapper;
import com.management.creatifpro.stock.models.dtos.SortieStockRequestDto;
import com.management.creatifpro.stock.models.dtos.SortieStockResponseDto;
import com.management.creatifpro.stock.models.entities.SortieStockEntity;
import com.management.creatifpro.stock.repositories.SortieStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SortieStockService {

    private final SortieStockRepository sortieStockRepository;
    private final SortieStockMapper sortieStockMapper;

    public List<SortieStockResponseDto> findAll() {
        return sortieStockMapper.toDtoList(sortieStockRepository.findAll());
    }

    public SortieStockResponseDto getById(Long id) {
        SortieStockEntity entity = sortieStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sortie stock non trouvée avec l'id: " + id));
        return sortieStockMapper.toDto(entity);
    }

    public SortieStockResponseDto create(SortieStockRequestDto dto) {
        SortieStockEntity entity = sortieStockMapper.toEntity(dto);
        SortieStockEntity saved = sortieStockRepository.save(entity);
        return sortieStockMapper.toDto(saved);
    }

    public SortieStockResponseDto update(SortieStockRequestDto dto) {
        SortieStockEntity entity = sortieStockRepository.findById(dto.id())
                .orElseThrow(() -> new RuntimeException("Sortie stock non trouvée avec l'id: " + dto.id()));
        entity.setNomComplet(dto.nomComplet());
        entity.setNomProduit(dto.nomProduit());
        entity.setTypeProduit(dto.typeProduit());
        entity.setUniteProduit(dto.uniteProduit());
        entity.setPoids(dto.poids());
        entity.setQuantite(dto.quantite());
        entity.setChantier(dto.chantier());
        SortieStockEntity saved = sortieStockRepository.save(entity);
        return sortieStockMapper.toDto(saved);
    }

    public void delete(Long id) {
        if (!sortieStockRepository.existsById(id)) {
            throw new RuntimeException("Sortie stock non trouvée avec l'id: " + id);
        }
        sortieStockRepository.deleteById(id);
    }
}
