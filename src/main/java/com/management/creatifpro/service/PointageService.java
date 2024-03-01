package com.management.creatifpro.service;

import com.management.creatifpro.dto.EmployeDto;
import com.management.creatifpro.dto.PointageDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.dto.SemainePointageDto;
import com.management.creatifpro.entity.JourPointageEntity;
import com.management.creatifpro.entity.PointageEntity;
import com.management.creatifpro.entity.SemainePointageEntity;
import com.management.creatifpro.exception.AppException;
import com.management.creatifpro.mapper.JourPointageMapper;
import com.management.creatifpro.mapper.PointageMapper;
import com.management.creatifpro.mapper.SemainePointageMapper;
import com.management.creatifpro.repository.JourPointageRepository;
import com.management.creatifpro.repository.PointageRepository;
import com.management.creatifpro.repository.SemainePointageRepository;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PointageService {

    private final PointageRepository pointageRepository;
    private final JourPointageRepository jourPointageRepository;
    private final SemainePointageRepository semainePointageRepository;
    private final PointageMapper pointageMapper;
    private final JourPointageMapper jourPointageMapper;
    private final SemainePointageMapper semainePointageMapper;

    public Page<PointageDto> findAll(SearchDto searchDto) {
        Pageable pageable = PageRequest
                .of(searchDto.page().orElse(0), searchDto.size().orElse(10))
                .withSort(searchDto.sort().orElse(Sort.by(Sort.Direction.ASC, "id")));
        Optional<Specification<PointageEntity>> nomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("employe.nom", value));
        Optional<Specification<PointageEntity>> prenomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("employe.prenom", value));
        Optional<Specification<PointageEntity>> cinSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("employe.cin", value));

        return Stream.of(nomSpec, prenomSpec, cinSpec)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::or)
                .map(specs -> pointageMapper.toDtoPage(pointageRepository.findAll(specs, pageable), pageable))
                .orElseGet(() -> pointageMapper.toDtoPage(pointageRepository.findAll(pageable), pageable));
    }

    @Transactional
    public PointageDto create(PointageDto pointageDto) {

        validateEmploye(pointageDto.employe());

        PointageEntity pointage = pointageRepository.save(pointageMapper.toMinimalEntity(pointageDto));

        List<SemainePointageEntity> semainePointages = new ArrayList<>();
        List<JourPointageEntity> jourPointages = new ArrayList<>();

        if (pointageDto.pointages() != null && !pointageDto.pointages().isEmpty()) {

            validateSemainePointage(pointageDto.pointages());

            for (SemainePointageDto semainePointageDto : pointageDto.pointages()) {
                SemainePointageEntity semainePointageEntity = semainePointageMapper.toMinimalEntity(semainePointageDto);
                semainePointageEntity.setPointageEntity(pointage);
                SemainePointageEntity semainePointage = semainePointageRepository.save(semainePointageEntity);

                List<JourPointageEntity> jourPointageEntities = jourPointageMapper.toMinimalEntityList(semainePointageDto.jourPointages());

                for (JourPointageEntity jourPointageEntity: jourPointageEntities){
                    jourPointageEntity.setSemainePointageEntity(semainePointage);
                    JourPointageEntity jourPointage = jourPointageRepository.save(jourPointageEntity);
                    jourPointages.add(jourPointage);
                }
                semainePointage.setPointages(jourPointages);
                semainePointages.add(semainePointage);
            }
            pointage.setPointages(semainePointages);
        }
        return pointageMapper.toDto(pointage);
    }

    @Transactional
    public PointageDto update(PointageDto pointageDto) {
        return pointageMapper
                .toDto(pointageRepository
                        .save(pointageMapper
                                .toEntity(pointageDto)));
    }

    public PointageDto findById(Long id) {
        return pointageMapper.toDto(pointageRepository
                .findById(id)
                .orElseThrow(() -> new AppException("Pointage with id: " + id + " not found", HttpStatus.NOT_FOUND)));
    }

    private void validateEmploye(EmployeDto employeDto) {
        if (employeDto == null || employeDto.id() == null) {
            throw new AppException("Employe is mandatory", HttpStatus.NOT_FOUND);
        } else {
            boolean isEmployeExist = pointageRepository.isExistByEmployeId(employeDto.id());
            if (isEmployeExist) {
                throw new AppException("Le pointage de l'employé avec l'id: " + employeDto.id() + " exist deja", HttpStatus.NOT_FOUND);
            }
        }
    }

    private void validateSemainePointage(List<SemainePointageDto> semainePointages){
        for (SemainePointageDto semainePointage: semainePointages){

        }
    }
}
