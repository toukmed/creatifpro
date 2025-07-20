package com.management.creatifpro.services;

import com.management.creatifpro.exceptions.AppException;
import com.management.creatifpro.mappers.PointageMapper;
import com.management.creatifpro.models.dtos.requests.CreatePointageRequestDto;
import com.management.creatifpro.models.dtos.requests.utils.DateRangeDto;
import com.management.creatifpro.models.dtos.requests.EmployeeRequestDto;
import com.management.creatifpro.models.dtos.requests.SearchPointageRequestDto;
import com.management.creatifpro.models.dtos.requests.UpdatePointageRequestDto;
import com.management.creatifpro.models.dtos.responses.PointageResponseDto;
import com.management.creatifpro.models.entities.PointageEntity;
import com.management.creatifpro.repositories.EmployeeRepository;
import com.management.creatifpro.repositories.PointageRepository;
import com.management.creatifpro.repositories.ProjectRepository;
import com.management.creatifpro.specifications.SpecificationsUtils;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class PointageService {

    private final PointageRepository pointageRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;
    private final PointageMapper pointageMapper;

    public Page<PointageResponseDto> search(SearchPointageRequestDto searchPointageRequestDto) {
        Pageable pageable = PageRequest
                .of(searchPointageRequestDto.pageIndex().orElse(0), searchPointageRequestDto.pageSize().orElse(10))
                .withSort(Sort.by(searchPointageRequestDto.sort().get().direction(), searchPointageRequestDto.sort().get().property()));

        return buildFilterStream(searchPointageRequestDto)
                .map(specs -> pointageMapper.toDtoPage(pointageRepository.findAll(specs, pageable), pageable))
                .orElseGet(() -> pointageMapper.toDtoPage(pointageRepository.findAll(pageable), pageable));
    }

    @Transactional
    public List<PointageResponseDto> create(CreatePointageRequestDto request) {
        validateDate(request.pointageDateRange());
        validateCreateExistance(request);
        List<PointageResponseDto> createdPointages = new ArrayList<>();
        for (EmployeeRequestDto employee : request.employees()) {
            request.pointageDateRange().start().datesUntil(request.pointageDateRange().end().plusDays(1)).forEach(date -> {
                createdPointages.add(pointageMapper.toDto(pointageRepository.save(pointageMapper.toEntity(request.project(), employee, date, request.totalHours(), request.comment()))));
            });
        }
        return createdPointages;
    }

    @Transactional
    public PointageResponseDto update(UpdatePointageRequestDto request) {
        PointageEntity existingPointage = pointageRepository.findById(request.id())
                .orElseThrow(() -> new AppException("Le pointage avec l'id: " + request.id() + " n'existe pas", HttpStatus.NOT_FOUND));
        existingPointage.setTotalHours(request.totalHours());
        existingPointage.setComment(request.comment());
        return pointageMapper.toDto(pointageRepository.save(existingPointage));

    }

    public PointageResponseDto findById(Long id) {
        return pointageMapper.toDto(pointageRepository
                .findById(id)
                .orElseThrow(() -> new AppException("Le pointage avec l'id: " + id + " n'existe pas", HttpStatus.NOT_FOUND)));
    }

    public void delete(Long id) {
        pointageRepository.deleteById(id);
    }

    private void validateUpdateExistance(UpdatePointageRequestDto request) {
            if (pointageRepository.exist(request.employee().id(), request.pointageDate())) {
                throw new AppException("Le pointage avec la date: [" + request.pointageDate() + "]", HttpStatus.BAD_REQUEST);
            }
    }

    private void validateCreateExistance(CreatePointageRequestDto request) {
        StringBuilder errorMessage = new StringBuilder();
        request.employees().
                forEach(employee -> request.pointageDateRange().start()
                        .datesUntil(request.pointageDateRange().end().plusDays(1))
                        .forEach(date -> {
                            if (pointageRepository.exist(employee.id(), date)) {
                                errorMessage.append("[ ")
                                        .append(employee.firstName())
                                        .append(" ")
                                        .append(employee.lastName())
                                        .append(date)
                                        .append("]")
                                        .append(System.lineSeparator());
                            }
                        }));
        if (!errorMessage.isEmpty()) {
            throw new AppException("Les pointages suivants: " + errorMessage + "existent déjà", HttpStatus.BAD_REQUEST);

        }
    }

    private static void validateDate(DateRangeDto pointageDateRange) {
        if (pointageDateRange.start().isAfter(LocalDate.now()) || pointageDateRange.end().isAfter(LocalDate.now())) {
            throw new AppException("Vous ne pouvez pas saisir un pointage dans le future, merci de corriger la date de pointage", HttpStatus.BAD_REQUEST);
        }
        if (pointageDateRange.start().isAfter(pointageDateRange.end())) {
            throw new AppException("La date de début doit etre après la date de fin", HttpStatus.BAD_REQUEST);
        }
    }

    private Optional<Specification<PointageEntity>> buildLabelSpec(SearchPointageRequestDto dto) {
        Optional<Specification<PointageEntity>> firstNameSpec = dto.label()
                .map(value -> SpecificationsUtils.likeValue("employee.firstName", value));

        Optional<Specification<PointageEntity>> lastNameSpec = dto.label()
                .map(value -> SpecificationsUtils.likeValue("employee.lastName", value));

        return Stream.of(firstNameSpec, lastNameSpec)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::or);
    }

    private Optional<Specification<PointageEntity>> buildFilterStream(SearchPointageRequestDto dto) {
        final LocalDate startDate = dto.startDate().orElse(null);
        final LocalDate endDate = dto.endDate().orElse(null);

        Optional<Specification<PointageEntity>> contractTypeSpec = dto.contractType()
                    .map(value -> SpecificationsUtils.enumEquals("employee.contractType", value));

        Optional<Specification<PointageEntity>> labelSpec = buildLabelSpec(dto);
        Optional<Specification<PointageEntity>> codeProjectSpec = dto.project()
                .map(value -> SpecificationsUtils.likeValue("project.code", value));
        Optional<Specification<PointageEntity>> dateSpec =
                (startDate != null || endDate != null)
                        ? Optional.of(SpecificationsUtils.betweenValues(startDate, endDate))
                        : Optional.empty();
        return Stream.of(labelSpec, contractTypeSpec, codeProjectSpec, dateSpec)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::and);
    }

}
