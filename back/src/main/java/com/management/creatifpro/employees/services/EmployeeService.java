package com.management.creatifpro.employees.services;

import com.management.creatifpro.common.specifications.EmployeeSpec;
import com.management.creatifpro.employees.mappers.EmployeeMapper;
import com.management.creatifpro.employees.models.dtos.EmployeeResponseDto;
import com.management.creatifpro.employees.models.dtos.SearchEmployeeRequestDto;
import com.management.creatifpro.employees.models.entities.EmployeeEntity;
import com.management.creatifpro.employees.repositories.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.management.creatifpro.common.utils.CreatifUtils.DEFAULT_PAGE_INDEX;
import static com.management.creatifpro.common.utils.CreatifUtils.DEFAULT_PAGE_SIZE;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
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

}
