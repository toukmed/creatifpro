package com.management.creatifpro.common.specifications;

import com.management.creatifpro.pointage.models.dtos.SearchPointageRequestDto;
import com.management.creatifpro.pointage.models.entities.PointageEntity;
import jakarta.persistence.criteria.Subquery;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.Optional;
import java.util.stream.Stream;

@Slf4j
public class PointageSpec {

    public static Optional<Specification<PointageEntity>> searchSpecification(SearchPointageRequestDto dto) {
        // Always get only the latest pointage per employee
        Specification<PointageEntity> baseSpec = latestPointagePerEmployee();

        Optional<Specification<PointageEntity>> filterSpec = Stream.of(
                        buildLabelSpec(dto),
                        buildProjectSpec(dto))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::and);

        return Optional.of(filterSpec
                .map(baseSpec::and)
                .orElse(baseSpec));
    }

    public static Optional<Specification<PointageEntity>> listByEmployeeIdSpecification(Long id, SearchPointageRequestDto dto) {
        log.info("Building listByEmployeeIdSpecification - id: {}, startDate: {}, endDate: {}",
                id, dto.startDate(), dto.endDate());

        Optional<Specification<PointageEntity>> employeeSpec = buildEmployeeIdSpec(id);
        Optional<Specification<PointageEntity>> dateRangeSpec = buildDateRangeSpec(dto);

        log.info("employeeSpec present: {}, dateRangeSpec present: {}",
                employeeSpec.isPresent(), dateRangeSpec.isPresent());

        return Stream.of(employeeSpec, dateRangeSpec)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::and);
    }

    /**
     * Returns only the latest pointage (by pointage_date) for each employee
     */
    private static Specification<PointageEntity> latestPointagePerEmployee() {
        return (root, query, cb) -> {
            // Subquery: SELECT MAX(pointage_date) FROM pointages GROUP BY employee_id
            Subquery<LocalDate> maxDateSubquery = query.subquery(LocalDate.class);
            var subRoot = maxDateSubquery.from(PointageEntity.class);
            maxDateSubquery.select(cb.greatest(subRoot.<LocalDate>get("pointageDate")))
                    .where(cb.equal(subRoot.get("employee"), root.get("employee")));

            return cb.equal(root.get("pointageDate"), maxDateSubquery);
        };
    }

    private static Optional<Specification<PointageEntity>> buildLabelSpec(SearchPointageRequestDto dto) {
        return dto.label()
                .filter(label -> !label.isBlank())
                .map(label -> {
                    Specification<PointageEntity> firstNameSpec = SpecificationsUtils.likeValue("employee.firstName", label);
                    Specification<PointageEntity> lastNameSpec = SpecificationsUtils.likeValue("employee.lastName", label);
                    return firstNameSpec.or(lastNameSpec);
                });
    }

    private static Optional<Specification<PointageEntity>> buildProjectSpec(SearchPointageRequestDto dto) {
        return dto.project()
                .filter(project -> !project.isBlank())
                .map(project -> SpecificationsUtils.likeValue("project.code", project));
    }

    private static Optional<Specification<PointageEntity>> buildEmployeeIdSpec(Long id) {
        return Optional.ofNullable(id)
                .map(employeeId -> (Specification<PointageEntity>) (root, query, cb) ->
                        cb.equal(root.get("employee").get("id"), employeeId));
    }

    private static Optional<Specification<PointageEntity>> buildDateRangeSpec(SearchPointageRequestDto dto) {
        return dto.startDate().flatMap(start ->
                dto.endDate().map(end -> SpecificationsUtils.betweenValues(start, end)));
    }
}
