package com.management.creatifpro.specifications;

import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.Arrays;

public class SpecificationsUtils {
    public static <T> Specification<T> likeValue(String path, String value) {
        String[] pathArray = path.split("\\.");
        return (root, query, cb) -> {
            Path<String> pathT = root.get(pathArray[0]);
            for (String p : Arrays.stream(pathArray).skip(1).toList()) {
                pathT = pathT.get(p);
            }

            return cb.like(cb.lower(pathT), "%" + value.toLowerCase() + "%");
        };
    }

    public static <T, E extends Enum<E>> Specification<T> enumEquals(String path, E enumValue) {
        String[] pathArray = path.split("\\.");
        return (root, query, cb) -> {
            Path<Object> pathT = root.get(pathArray[0]);
            for (String p : Arrays.stream(pathArray).skip(1).toList()) {
                pathT = pathT.get(p);
            }

            // Compare enum values directly
            return cb.equal(pathT, enumValue);
        };
    }

    public static <T> Specification<T> equals(String path, Long value) {
        String[] pathArray = path.split("\\.");
        return (root, query, cb) -> {
            Path<String> pathT = root.get(pathArray[0]);
            for (String p : Arrays.stream(pathArray).skip(1).toList()) {
                pathT = pathT.get(p);
            }

            return cb.equal(pathT, value);
        };
    }

    public static <T> Specification<T> betweenValues(LocalDate startDate, LocalDate endDate) {

        return (root, query, criteriaBuilder) ->
                criteriaBuilder.between(root.get("pointageDate"), startDate, endDate);
    }

    public static <T> Specification<T> booleanValue(String path, boolean value) {
        String[] pathArray = path.split("\\.");
        return (root, query, cb) -> {
            Path<Boolean> pathT = root.get(pathArray[0]);
            for (String p : Arrays.stream(pathArray).skip(1).toList()) {
                pathT = pathT.get(p);
            }
            return cb.equal(pathT, value);
        };
    }

    public static <T> Specification<T> orderASCBy(String fieldName) {
        return (root, query, criteriaBuilder) -> {
            query.orderBy(criteriaBuilder.asc(root.get(fieldName)));
            return criteriaBuilder.conjunction();
        };
    }
}
