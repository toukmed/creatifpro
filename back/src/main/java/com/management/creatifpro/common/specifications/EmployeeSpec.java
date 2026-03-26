package com.management.creatifpro.common.specifications;

import com.management.creatifpro.employees.models.dtos.SearchEmployeeRequestDto;
import com.management.creatifpro.employees.models.entities.EmployeeEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;
import java.util.stream.Stream;

public class EmployeeSpec {

    public static Optional<Specification<EmployeeEntity>> buildSpecification(SearchEmployeeRequestDto dto) {

        return Stream.of(
                        buildLabelSpec(dto),
                        buildProjectSpec(dto))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::and);

    }

    private static Optional<Specification<EmployeeEntity>> buildLabelSpec(SearchEmployeeRequestDto dto) {
        return dto.label()
                .filter(label -> !label.isBlank())
                .map(label -> {
                    Specification<EmployeeEntity> firstNameSpec = SpecificationsUtils.likeValue("employee.firstName", label);
                    Specification<EmployeeEntity> lastNameSpec = SpecificationsUtils.likeValue("employee.lastName", label);
                    Specification<EmployeeEntity> cinSpec = SpecificationsUtils.likeValue("employee.cin", label);
                    return firstNameSpec.or(lastNameSpec).or(cinSpec);
                });
    }

    private static Optional<Specification<EmployeeEntity>> buildProjectSpec(SearchEmployeeRequestDto dto) {
        return dto.project()
                .filter(project -> !project.isBlank())
                .map(project -> SpecificationsUtils.likeValue("project.code", project));
    }
}
