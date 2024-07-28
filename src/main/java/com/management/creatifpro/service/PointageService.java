package com.management.creatifpro.service;

import com.management.creatifpro.dto.PointageDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.entity.JourPointageEntity;
import com.management.creatifpro.entity.PointageEntity;
import com.management.creatifpro.exception.AppException;
import com.management.creatifpro.mapper.JourPointageMapper;
import com.management.creatifpro.mapper.PointageMapper;
import com.management.creatifpro.repository.JourPointageRepository;
import com.management.creatifpro.repository.PointageRepository;
import com.management.creatifpro.specification.SpecificationsUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.management.creatifpro.util.CreatifUtils.DATE_FORMATTER;

@Service
@RequiredArgsConstructor
public class PointageService implements GenericService<PointageEntity, SearchDto, PointageDto>{

    private final PointageRepository pointageRepository;
    private final JourPointageRepository jourPointageRepository;
    private final PointageMapper pointageMapper;
    private final JourPointageMapper jourPointageMapper;

    @Override
    public Page<PointageDto> findAll(SearchDto searchDto) {
        Pageable pageable = PageRequest
                .of(searchDto.page().orElse(0), searchDto.size().orElse(10))
                .withSort(searchDto.sort().orElse(Sort.by(Sort.Direction.ASC, "id")));

        Page<PointageEntity> pointageEntityPage = buildFilterStream(searchDto)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::or)
                .map(specs -> pointageRepository.findAll(specs, pageable))
                .orElseGet(() -> pointageRepository.findAll(pageable));

        if (searchDto.weekStartDate().isPresent() && searchDto.weekEndDate().isPresent()) {
            List<PointageEntity> updatedPointageEntityList = filterPointageByDates(searchDto, pointageEntityPage);

            return pointageMapper.toDtoPage(new PageImpl<>(updatedPointageEntityList), pageable);
        }

        return pointageMapper.toDtoPage(pointageEntityPage, pageable);
    }

    @Transactional
    public List<PointageDto> create(List<PointageDto> pointageDtos) {

        List<PointageDto> savedPointages = new ArrayList<>();

        for (PointageDto pointageDto : pointageDtos) {
            PointageEntity pointage = pointageRepository
                    .findById(pointageDto.id())
                    .orElseThrow(() -> new AppException("Pointage with id: " + pointageDto.id() + " not found", HttpStatus.NOT_FOUND));

            List<JourPointageEntity> savedJourPointages = jourPointageRepository.saveAll(filterJourPointages(pointageDto, pointage));

            pointage.setPointages(savedJourPointages);

            savedPointages.add(pointageMapper.toDto(pointage));
        }

        return savedPointages;
    }

    @Transactional
    @Override
    public PointageDto update(PointageDto pointageDto) {
        return pointageMapper
                .toDto(pointageRepository
                        .save(pointageMapper
                                .toEntity(pointageDto)));
    }

    @Override
    public PointageDto findById(Long id) {
        return pointageMapper.toDto(pointageRepository
                .findById(id)
                .orElseThrow(() -> new AppException("Pointage with id: " + id + " not found", HttpStatus.NOT_FOUND)));
    }


    private List<JourPointageEntity> filterJourPointages(PointageDto pointageDto, PointageEntity pointage) {
        return pointageDto
                .pointages()
                .stream()
                .filter(jourPointageDto -> !jourPointageRepository.isExistByDateAndPointageId(LocalDate.parse(jourPointageDto.jourPointage(), DATE_FORMATTER), pointageDto.id()))
                .map(jourPointage -> {
                    JourPointageEntity jourPointageEntity = jourPointageMapper.toMinimalEntity(jourPointage);
                    jourPointageEntity.setPointageEntity(pointage);
                    return jourPointageEntity;
                })
                .toList();
    }

    private static List<PointageEntity> filterPointageByDates(SearchDto searchDto, Page<PointageEntity> pointageEntityPage) {
        LocalDate startDate = LocalDate.parse(searchDto.weekStartDate().get(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(searchDto.weekEndDate().get(), DATE_FORMATTER);

        List<PointageEntity> pointageEntityList = pointageEntityPage.getContent();

        return pointageEntityList.stream()
                .map(pointageEntity -> {
                    List<JourPointageEntity> filteredJourPointageList = pointageEntity.getPointages().stream()
                            .filter(jourPointageEntity -> {
                                LocalDate jourPointage = jourPointageEntity.getJourPointage();
                                return jourPointage.isAfter(startDate.minusDays(1)) && jourPointage.isBefore(endDate.plusDays(1));
                            })
                            .collect(Collectors.toList());
                    pointageEntity.setPointages(filteredJourPointageList);
                    return pointageEntity;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Stream<Optional<Specification<PointageEntity>>> buildFilterStream(SearchDto searchDto) {
        Optional<Specification<PointageEntity>> nomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("employe.nom", value));
        Optional<Specification<PointageEntity>> prenomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("employe.prenom", value));
        Optional<Specification<PointageEntity>> cinSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("employe.cin", value));

        return Stream.of(nomSpec, prenomSpec, cinSpec);
    }

}
