package com.management.creatifpro.service;

import com.management.creatifpro.dto.ProjetDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.entity.ProjetEntity;
import com.management.creatifpro.exception.AppException;
import com.management.creatifpro.mapper.ProjetMapper;
import com.management.creatifpro.repository.ProjetRepository;
import com.management.creatifpro.specification.SpecificationsUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProjetService {

    private final ProjetRepository projetRepository;
    private final ProjetMapper projetMapper;

    public Page<ProjetDto> findAll(SearchDto searchDto){
        Pageable pageable = PageRequest
                .of(searchDto.page().orElse(0), searchDto.size().orElse(10))
                .withSort(searchDto.sort().orElse(Sort.by(Sort.Direction.ASC, "nom")));
        Optional<Specification<ProjetEntity>> nomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("nom", value));
        Optional<Specification<ProjetEntity>> prenomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("reference", value));

        return Stream.of(nomSpec, prenomSpec)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::or)
                .map(specs -> projetMapper.toDtoPage(projetRepository.findAll(specs, pageable), pageable))
                .orElseGet(() -> projetMapper.toDtoPage(projetRepository.findAll(pageable), pageable));
    }

    @Transactional
    public ProjetDto create(ProjetDto projetDto){
        return projetMapper
                .toDto(projetRepository
                        .save(projetMapper
                                .toEntity(projetDto)));
    }

    @Transactional
    public ProjetDto update(ProjetDto projetDto){
        ProjetEntity projetEntity = projetRepository
                .findById(projetDto.id()).orElseThrow(() -> new AppException("Projet with id: " + projetDto.id() + " not found", HttpStatus.NOT_FOUND));
        ProjetEntity newEntity = projetMapper.toEntity(projetDto);
        return projetMapper
                .toDto(projetRepository
                        .save(projetMapper
                                .copyContent(newEntity, projetEntity)));
    }

    public ProjetDto findById(Long id){
        return projetMapper.toDto(projetRepository
                .findById(id)
                .orElseThrow(() -> new AppException("Projet with id: " + id + " not found", HttpStatus.NOT_FOUND)));
    }
}
