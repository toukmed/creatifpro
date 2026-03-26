package com.management.creatifpro.pointage.services;

import com.management.creatifpro.common.exceptions.AppException;
import com.management.creatifpro.common.specifications.PointageSpec;
import com.management.creatifpro.common.utils.DateRangeDto;
import com.management.creatifpro.employees.models.dtos.EmployeeRequestDto;
import com.management.creatifpro.pointage.mappers.PointageMapper;
import com.management.creatifpro.pointage.models.dtos.CreatePointageRequestDto;
import com.management.creatifpro.pointage.models.dtos.PointageResponseDto;
import com.management.creatifpro.pointage.models.dtos.SearchPointageRequestDto;
import com.management.creatifpro.pointage.models.dtos.UpdatePointageRequestDto;
import com.management.creatifpro.pointage.models.entities.PointageEntity;
import com.management.creatifpro.pointage.repositories.PointageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static com.management.creatifpro.common.utils.CreatifUtils.DEFAULT_PAGE_INDEX;
import static com.management.creatifpro.common.utils.CreatifUtils.DEFAULT_PAGE_SIZE;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointageService {


    private final PointageRepository pointageRepository;
    private final PointageMapper pointageMapper;

    public Page<PointageResponseDto> search(SearchPointageRequestDto request) {
        log.info("Search request: label={}, project={}",
                request.label(), request.project());

        Pageable pageable = PageRequest.of(
                request.pageIndex().orElse(DEFAULT_PAGE_INDEX),
                request.pageSize().orElse(DEFAULT_PAGE_SIZE),
                request.sort().map(s -> Sort.by(s.direction(), s.property()))
                        .orElse(Sort.unsorted())
        );

        Optional<Specification<PointageEntity>> specOpt = PointageSpec.searchSpecification(request);
        log.info("Specification present: {}", specOpt.isPresent());

        Page<PointageEntity> result = specOpt
                .map(spec -> pointageRepository.findAll(spec, pageable))
                .orElseGet(() -> pointageRepository.findAll(pageable));

        log.info("Result count: {}, total elements: {}", result.getContent().size(), result.getTotalElements());

        return pointageMapper.toDtoPage(result, pageable);
    }

    public List<PointageResponseDto> listByEmployeeId(Long id, SearchPointageRequestDto request) {
        log.info("List pointages by employee id: {}", id);

        Optional<Specification<PointageEntity>> specOpt = PointageSpec.listByEmployeeIdSpecification(id, request);
        log.info("Specification present for employee {}: {}", id, specOpt.isPresent());

        Sort sort = request.sort()
                .map(s -> Sort.by(s.direction(), s.property()))
                .orElse(Sort.by(Sort.Direction.ASC, "pointageDate"));

        List<PointageEntity> result = specOpt
                .map(spec -> pointageRepository.findAll(spec, sort))
                .orElseGet(() -> pointageRepository.findAll(sort));

        log.info("Found {} pointages for employee {}", result.size(), id);

        return pointageMapper.toDtoList(result);
    }

    @Transactional
    public List<PointageResponseDto> create(CreatePointageRequestDto request) {
        validateDateRange(request.pointageDateRange());
        validateNoExistingPointages(request);

        return request.employees().stream()
                .flatMap(employee -> getDateRange(request.pointageDateRange())
                        .map(date -> createPointage(request, employee, date)))
                .toList();
    }

    @Transactional
    public PointageResponseDto update(UpdatePointageRequestDto request) {
        PointageEntity existingPointage = findPointageById(request.id());
        existingPointage.setTotalHours(request.totalHours());
        existingPointage.setComment(request.comment());
        return pointageMapper.toDto(pointageRepository.save(existingPointage));
    }

    public PointageResponseDto findById(Long id) {
        return pointageMapper.toDto(findPointageById(id));
    }

    public void delete(Long id) {
        pointageRepository.deleteById(id);
    }

    private PointageEntity findPointageById(Long id) {
        return pointageRepository.findById(id)
                .orElseThrow(() -> new AppException(
                        "Le pointage avec l'id: " + id + " n'existe pas", HttpStatus.NOT_FOUND));
    }

    private PointageResponseDto createPointage(CreatePointageRequestDto request, EmployeeRequestDto employee, LocalDate date) {
        PointageEntity entity = pointageMapper.toEntity(
                request.project(), employee, date, request.totalHours(), request.comment()
        );
        return pointageMapper.toDto(pointageRepository.save(entity));
    }

    private void validateNoExistingPointages(CreatePointageRequestDto request) {
        List<String> existingPointages = request.employees().stream()
                .flatMap(employee -> getDateRange(request.pointageDateRange())
                        .filter(date -> pointageRepository.exist(employee.id(), date))
                        .map(date -> String.format("[ %s %s - %s ]",
                                employee.firstName(), employee.lastName(), date)))
                .toList();

        if (!existingPointages.isEmpty()) {
            throw new AppException(
                    "Les pointages suivants existent déjà : " + String.join(", ", existingPointages),
                    HttpStatus.BAD_REQUEST);
        }
    }

    private void validateDateRange(DateRangeDto dateRange) {
        LocalDate today = LocalDate.now();
        if (dateRange.start().isAfter(today) || dateRange.end().isAfter(today)) {
            throw new AppException(
                    "Vous ne pouvez pas saisir un pointage dans le futur, merci de corriger la date de pointage",
                    HttpStatus.BAD_REQUEST);
        }
        if (dateRange.start().isAfter(dateRange.end())) {
            throw new AppException(
                    "La date de début doit être avant la date de fin",
                    HttpStatus.BAD_REQUEST);
        }
    }

    private Stream<LocalDate> getDateRange(DateRangeDto dateRange) {
        return dateRange.start().datesUntil(dateRange.end().plusDays(1));
    }


}
