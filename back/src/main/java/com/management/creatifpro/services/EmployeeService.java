package com.management.creatifpro.services;

import com.management.creatifpro.mappers.EmployeeMapper;
import com.management.creatifpro.models.dtos.requests.SearchEmployeeRequestDto;
import com.management.creatifpro.models.dtos.responses.EmployeeResponseDto;
import com.management.creatifpro.models.entities.EmployeeEntity;
import com.management.creatifpro.repositories.EmployeeRepository;
import com.management.creatifpro.specifications.SpecificationsUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    public Page<EmployeeResponseDto> search(SearchEmployeeRequestDto dto) {
        Pageable pageable = PageRequest
                .of(dto.pageIndex().orElse(0), dto.pageSize().orElse(10))
                .withSort(Sort.by(dto.sort().get().direction(), dto.sort().get().property()));

        return buildFilterStream(dto)
                .map(specs -> employeeMapper.toDtoPage(employeeRepository.findAll(specs, pageable), pageable))
                .orElseGet(() -> employeeMapper.toDtoPage(employeeRepository.findAll(pageable), pageable));
    }

    private Optional<Specification<EmployeeEntity>> buildFilterStream(SearchEmployeeRequestDto dto) {

        Optional<Specification<EmployeeEntity>> contractTypeSpec = dto.contractType()
                .map(value -> SpecificationsUtils.enumEquals("contractType", value));

        Optional<Specification<EmployeeEntity>> codeProjectSpec = dto.project()
                .map(value -> SpecificationsUtils.likeValue("project.code", value));

        return Stream.of(contractTypeSpec, codeProjectSpec)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::and);
    }
}
