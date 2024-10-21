package com.management.creatifpro.mapper;

import com.management.creatifpro.dto.EmployeDto;
import com.management.creatifpro.dto.EmployeMinimalDto;
import com.management.creatifpro.entity.EmployeEntity;
import com.management.creatifpro.exception.AppException;
import com.management.creatifpro.mapper.generic.GenericMapper;
import com.management.creatifpro.repository.ProjetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class EmployeMapper extends GenericMapper<EmployeDto, EmployeEntity> {

    private final ProjetMapper projetMapper;
    private final ProjetRepository projetRepository;

    @Override
    public EmployeDto toDto(EmployeEntity entity) {
        return EmployeDto
                .builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .prenom(entity.getPrenom())
                .cin(entity.getCin())
                .numeroTelephone(entity.getNumeroTelephone())
                .dateIntegration(entity.getDateIntegration().format(DATE_FORMATTER))
                .tarifJournalier(entity.getTarifJournalier())
                .poste(entity.getPoste())
                .salaireMensuel(entity.getSalaireMensuel())
                .typeContrat(entity.getTypeContrat())
                .projet(projetMapper.toDto(entity.getProjet()))
                .build();
    }

    public EmployeMinimalDto toMinimalDto(EmployeEntity entity) {
        return EmployeMinimalDto
                .builder()
                .id(entity.getId())
                .nom(entity.getNom())
                .prenom(entity.getPrenom())
                .projet(projetMapper.toDto(entity.getProjet()))
                .typeContrat(entity.getTypeContrat())
                .poste(entity.getPoste())
                .numeroTelephone(entity.getNumeroTelephone())
                .build();
    }

    @Override
    public EmployeEntity toEntity(EmployeDto entityDto) {
        return EmployeEntity
                .builder()
                .nom(entityDto.nom())
                .prenom(entityDto.prenom())
                .cin(entityDto.cin())
                .numeroTelephone(entityDto.numeroTelephone())
                .dateIntegration(LocalDate.parse(entityDto.dateIntegration(), DATE_FORMATTER))
                .tarifJournalier(entityDto.tarifJournalier())
                .salaireMensuel(entityDto.salaireMensuel())
                .poste(entityDto.poste())
                .typeContrat(entityDto.typeContrat())
                .projet(entityDto.projet() != null ? projetRepository
                        .findById(entityDto.projet().id())
                        .orElseThrow(() -> new AppException("Projet with id: " + entityDto.projet().id() + " not found", HttpStatus.NOT_FOUND))
                        : null)
                .build();
    }

    @Override
    public EmployeEntity toMinimalEntity(EmployeDto entityDto) {
        return toEntity(entityDto);
    }

    public EmployeEntity copyContent(EmployeEntity source, EmployeEntity target){
        target.setNom(source.getNom());
        target.setPrenom(source.getPrenom());
        target.setCin(source.getCin());
        target.setNumeroTelephone(source.getNumeroTelephone());
        target.setTypeContrat(source.getTypeContrat());
        target.setTarifJournalier(source.getTarifJournalier());
        target.setSalaireMensuel(source.getSalaireMensuel());
        target.setProjet(source.getProjet());
        target.setPoste(source.getPoste());
        target.setDateIntegration(source.getDateIntegration());
        return target;
    }
}
