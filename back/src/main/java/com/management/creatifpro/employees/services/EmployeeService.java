package com.management.creatifpro.employees.services;

import com.management.creatifpro.common.exceptions.AppException;
import com.management.creatifpro.common.specifications.EmployeeSpec;
import com.management.creatifpro.employees.mappers.EmployeeMapper;
import com.management.creatifpro.employees.models.dtos.EmployeeRequestDto;
import com.management.creatifpro.employees.models.dtos.EmployeeResponseDto;
import com.management.creatifpro.employees.models.dtos.SearchEmployeeRequestDto;
import com.management.creatifpro.employees.models.entities.EmployeeEntity;
import com.management.creatifpro.employees.repositories.EmployeeRepository;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import com.management.creatifpro.projects.repositories.ProjectRepository;
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

import java.util.Optional;

import static com.management.creatifpro.common.utils.CreatifUtils.DEFAULT_PAGE_INDEX;
import static com.management.creatifpro.common.utils.CreatifUtils.DEFAULT_PAGE_SIZE;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeMapper employeeMapper;

    public Page<EmployeeResponseDto> search(SearchEmployeeRequestDto request) {
        log.info("Search request: label={}, project={}",
                request.label(), request.project());

        Pageable pageable = PageRequest.of(
                request.pageIndex().orElse(DEFAULT_PAGE_INDEX),
                request.pageSize().orElse(DEFAULT_PAGE_SIZE),
                request.sort().map(s -> Sort.by(s.direction(), s.property()))
                        .orElse(Sort.unsorted())
        );

        Optional<Specification<EmployeeEntity>> specOpt = EmployeeSpec.buildSpecification(request);
        log.info("Specification present: {}", specOpt.isPresent());

        Page<EmployeeEntity> result = specOpt
                .map(spec -> employeeRepository.findAll(spec, pageable))
                .orElseGet(() -> employeeRepository.findAll(pageable));

        log.info("Result count: {}, total elements: {}", result.getContent().size(), result.getTotalElements());

        return employeeMapper.toDtoPage(result, pageable);
    }

    public EmployeeResponseDto getById(Long id) {
        EmployeeEntity entity = findEmployeeById(id);
        return employeeMapper.toDto(entity);
    }

    @Transactional
    public EmployeeResponseDto create(EmployeeRequestDto request) {
        log.info("Creating employee: {} {}", request.firstName(), request.lastName());

        if (employeeRepository.existsByCin(request.cin())) {
            throw new AppException("Un employé avec le CIN " + request.cin() + " existe déjà", HttpStatus.CONFLICT);
        }

        ProjectEntity project = resolveProject(request.projectId());
        EmployeeEntity entity = employeeMapper.toEntity(request, project);
        EmployeeEntity saved = employeeRepository.save(entity);
        log.info("Employee created with id: {}", saved.getId());
        return employeeMapper.toDto(saved);
    }

    @Transactional
    public EmployeeResponseDto update(EmployeeRequestDto request) {
        log.info("Updating employee with id: {}", request.id());

        EmployeeEntity existing = findEmployeeById(request.id());

        if (employeeRepository.existsByCinAndNotTheSameEmploye(request.cin(), request.id())) {
            throw new AppException("Un autre employé avec le CIN " + request.cin() + " existe déjà", HttpStatus.CONFLICT);
        }

        ProjectEntity project = resolveProject(request.projectId());

        existing.setFirstName(request.firstName());
        existing.setLastName(request.lastName());
        existing.setCin(request.cin());
        existing.setPhoneNumber(request.phoneNumber());
        existing.setJobRole(request.jobRole());
        existing.setIntegrationDate(request.dateIntegration());
        existing.setDailyRate(request.dailyRate());
        existing.setSalary(request.salary());
        existing.setProject(project);

        EmployeeEntity saved = employeeRepository.save(existing);
        log.info("Employee updated with id: {}", saved.getId());
        return employeeMapper.toDto(saved);
    }

    @Transactional
    public void delete(Long id) {
        log.info("Deleting employee with id: {}", id);
        if (!employeeRepository.existsById(id)) {
            throw new AppException("Employé non trouvé avec l'id: " + id, HttpStatus.NOT_FOUND);
        }
        employeeRepository.deleteById(id);
        log.info("Employee deleted with id: {}", id);
    }

    private EmployeeEntity findEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new AppException(
                        "Employé non trouvé avec l'id: " + id, HttpStatus.NOT_FOUND));
    }

    private ProjectEntity resolveProject(Long projectId) {
        if (projectId == null) {
            return null;
        }
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new AppException(
                        "Projet non trouvé avec l'id: " + projectId, HttpStatus.NOT_FOUND));
    }

}
