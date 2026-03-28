package com.management.creatifpro.materiels.services;

import com.management.creatifpro.materiels.mappers.MaterielMapper;
import com.management.creatifpro.materiels.models.dtos.MaterielRequestDto;
import com.management.creatifpro.materiels.models.dtos.MaterielResponseDto;
import com.management.creatifpro.materiels.models.entities.MaterielEntity;
import com.management.creatifpro.materiels.repositories.MaterielRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterielService {

    private final MaterielRepository materielRepository;
    private final MaterielMapper materielMapper;

    public List<MaterielResponseDto> findAll() {
        return materielMapper.toDtoList(materielRepository.findAll());
    }

    public MaterielResponseDto getById(Long id) {
        MaterielEntity entity = materielRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matériel non trouvé avec l'id: " + id));
        return materielMapper.toDto(entity);
    }

    public MaterielResponseDto create(MaterielRequestDto dto) {
        MaterielEntity entity = materielMapper.toEntity(dto);
        MaterielEntity saved = materielRepository.save(entity);
        return materielMapper.toDto(saved);
    }

    public MaterielResponseDto update(MaterielRequestDto dto) {
        MaterielEntity entity = materielRepository.findById(dto.id())
                .orElseThrow(() -> new RuntimeException("Matériel non trouvé avec l'id: " + dto.id()));
        entity.setNom(dto.nom());
        entity.setReference(dto.reference());
        entity.setChantier(dto.chantier());
        MaterielEntity saved = materielRepository.save(entity);
        return materielMapper.toDto(saved);
    }

    public void delete(Long id) {
        if (!materielRepository.existsById(id)) {
            throw new RuntimeException("Matériel non trouvé avec l'id: " + id);
        }
        materielRepository.deleteById(id);
    }
}
