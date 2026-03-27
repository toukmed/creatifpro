package com.management.creatifpro.stock.services;

import com.management.creatifpro.stock.mappers.EntreeStockMapper;
import com.management.creatifpro.stock.models.dtos.EntreeStockRequestDto;
import com.management.creatifpro.stock.models.dtos.EntreeStockResponseDto;
import com.management.creatifpro.stock.models.entities.EntreeStockEntity;
import com.management.creatifpro.stock.repositories.EntreeStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EntreeStockService {

    private final EntreeStockRepository entreeStockRepository;
    private final EntreeStockMapper entreeStockMapper;

    public List<EntreeStockResponseDto> findAll() {
        return entreeStockMapper.toDtoList(entreeStockRepository.findAll());
    }

    public EntreeStockResponseDto getById(Long id) {
        EntreeStockEntity entity = entreeStockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrée stock non trouvée avec l'id: " + id));
        return entreeStockMapper.toDto(entity);
    }

    public EntreeStockResponseDto create(EntreeStockRequestDto dto) {
        EntreeStockEntity entity = entreeStockMapper.toEntity(dto);
        EntreeStockEntity saved = entreeStockRepository.save(entity);
        return entreeStockMapper.toDto(saved);
    }

    public EntreeStockResponseDto update(EntreeStockRequestDto dto) {
        EntreeStockEntity entity = entreeStockRepository.findById(dto.id())
                .orElseThrow(() -> new RuntimeException("Entrée stock non trouvée avec l'id: " + dto.id()));
        entity.setNomComplet(dto.nomComplet());
        entity.setNomProduit(dto.nomProduit());
        entity.setTypeProduit(dto.typeProduit());
        entity.setUniteProduit(dto.uniteProduit());
        entity.setPoids(dto.poids());
        entity.setQuantite(dto.quantite());
        EntreeStockEntity saved = entreeStockRepository.save(entity);
        return entreeStockMapper.toDto(saved);
    }

    public void delete(Long id) {
        if (!entreeStockRepository.existsById(id)) {
            throw new RuntimeException("Entrée stock non trouvée avec l'id: " + id);
        }
        entreeStockRepository.deleteById(id);
    }
}
