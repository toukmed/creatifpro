package com.management.creatifpro.factures.services;

import com.management.creatifpro.factures.mappers.FactureMapper;
import com.management.creatifpro.factures.models.dtos.FactureRequestDto;
import com.management.creatifpro.factures.models.dtos.FactureResponseDto;
import com.management.creatifpro.factures.models.entities.FactureEntity;
import com.management.creatifpro.factures.repositories.FactureRepository;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import com.management.creatifpro.projects.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FactureService {

    private final FactureRepository factureRepository;
    private final FactureMapper factureMapper;
    private final ProjectRepository projectRepository;

    public List<FactureResponseDto> findAll() {
        return factureMapper.toDtoList(factureRepository.findAll());
    }

    public FactureResponseDto getById(Long id) {
        FactureEntity entity = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'id: " + id));
        return factureMapper.toDto(entity);
    }

    public FactureResponseDto create(FactureRequestDto dto) {
        FactureEntity entity = factureMapper.toEntity(dto);
        FactureEntity saved = factureRepository.save(entity);
        return factureMapper.toDto(saved);
    }

    public FactureResponseDto update(FactureRequestDto dto) {
        FactureEntity entity = factureRepository.findById(dto.id())
                .orElseThrow(() -> new RuntimeException("Facture non trouvée avec l'id: " + dto.id()));
        entity.setNumFacture(dto.numFacture());
        entity.setNBc(dto.nBc());
        entity.setMontantTtc(dto.montantTtc());
        entity.setDateFacture(dto.dateFacture());
        entity.setEtatPaiement(dto.etatPaiement());
        entity.setDatePaiement(dto.datePaiement());
        if (dto.projectId() != null) {
            ProjectEntity project = projectRepository.findById(dto.projectId())
                    .orElseThrow(() -> new RuntimeException("Projet non trouvé avec l'id: " + dto.projectId()));
            entity.setProject(project);
        } else {
            entity.setProject(null);
        }
        FactureEntity saved = factureRepository.save(entity);
        return factureMapper.toDto(saved);
    }

    public void delete(Long id) {
        if (!factureRepository.existsById(id)) {
            throw new RuntimeException("Facture non trouvée avec l'id: " + id);
        }
        factureRepository.deleteById(id);
    }
}

