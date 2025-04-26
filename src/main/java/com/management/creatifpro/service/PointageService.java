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
import com.management.creatifpro.util.ContratEmploye;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.management.creatifpro.util.CreatifUtils.DATE_FORMATTER;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointageService implements GenericService<PointageEntity, SearchDto, PointageDto> {

    private final PointageRepository pointageRepository;
    private final JourPointageRepository jourPointageRepository;
    private final PointageMapper pointageMapper;
    private final JourPointageMapper jourPointageMapper;

    @Override
    public Page<PointageDto> findAll(SearchDto searchDto) {
        Pageable pageable = PageRequest
                .of(searchDto.page().orElse(0), searchDto.size().orElse(10))
                .withSort(searchDto.sort().orElse(Sort.by(Sort.Direction.ASC, "id")));

        return buildFilterStream(searchDto)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::and)
                .map(specs -> pointageMapper.toDtoPage(pointageRepository.findAll(specs, pageable),pageable))
                .orElseGet(() -> pointageMapper.toDtoPage(pointageRepository.findAll(pageable),pageable));
    }

    public List<PointageDto> findAll(String typeContrat) {
        return pointageMapper.toDtoList(pointageRepository.findAll());
    }

    @Transactional
    public void create(PointageDto pointageDto) {

        List<JourPointageEntity> pointagesToSave = new ArrayList<>();

        for (Long employeId : pointageDto.employesIds()) {

            pointageDto.startDate().datesUntil(pointageDto.endDate().plusDays(1)).forEach(date -> {
                Boolean exist = jourPointageRepository.isExistByEmployeIdAndJourPointage(employeId, date);
                if (!exist) {
                    JourPointageEntity jourPointage = JourPointageEntity.builder()
                            .pointage(Float.valueOf(pointageDto.pointage()))
                            .jourPointage(date)
                            .status(pointageDto.status())
                            .commentaire(pointageDto.commentaire())
                            .pointageEntity(pointageRepository
                                    .findByEmployeId(employeId)
                                    .orElseThrow(() -> new AppException("Pointage with id: " + pointageDto.id() + " not found", HttpStatus.NOT_FOUND)))
                            .build();
                    pointagesToSave.add(jourPointage);
                }
            });
            jourPointageRepository.saveAll(pointagesToSave);
            log.info("{} jours pointages saved successfully", pointagesToSave.size());
        }
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

    private static List<PointageEntity> filterPointageByDates(SearchDto searchDto, Page<PointageEntity> pointageEntityPage) {
        LocalDate startDate = LocalDate.parse(searchDto.startDate().get(), DATE_FORMATTER);
        LocalDate endDate = LocalDate.parse(searchDto.endDate().get(), DATE_FORMATTER);

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

    public void buildHeader(Row headerRow, LocalDate startDate, LocalDate endDate) {
        AtomicInteger count = new AtomicInteger(2);
        startDate.datesUntil(endDate.plusDays(1)).forEach(date -> {
            headerRow.createCell(count.get()).setCellValue(getFrenchDayOfWeek(date.getDayOfWeek())+" "+date.getDayOfMonth()+"/"+date.getMonthValue()+"/"+date.getYear());
            count.getAndIncrement();
        });
    }

    @Override
    public Stream<Optional<Specification<PointageEntity>>> buildFilterStream(SearchDto searchDto) {
        Optional<Specification<PointageEntity>> idPointageSpec = searchDto.idPointage()
                .map(value -> SpecificationsUtils.equals("id", value));
        Optional<Specification<PointageEntity>> nomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("employe.nom", value));
        Optional<Specification<PointageEntity>> prenomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("employe.prenom", value));
        Optional<Specification<PointageEntity>> cinSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("employe.cin", value));
        Optional<Specification<PointageEntity>> typeContratSpec = searchDto.typeContrat()
                .map(value -> SpecificationsUtils.enumEquals("employe.typeContrat", !value.isEmpty() ? ContratEmploye.valueOf(value) : null));
        return Stream.of(idPointageSpec, nomSpec, prenomSpec, cinSpec, typeContratSpec);
    }

    private static String getFrenchDayOfWeek(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> "Lun";
            case TUESDAY -> "Mar";
            case WEDNESDAY -> "Mer";
            case THURSDAY -> "Jeu";
            case FRIDAY -> "Ven";
            case SATURDAY -> "Sam";
            case SUNDAY -> "Dim";
        };
    }

}
