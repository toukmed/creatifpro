package com.management.creatifpro.common.specifications;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class SpecificationsUtils {

    public static <T> Specification<T> likeValue(String path, String value) {
        String[] pathArray = path.split("\\.");
        return (root, query, cb) -> {
            Path<String> pathT;
            if (pathArray.length > 1) {
                // Use JOIN for nested paths (relations)
                Join<Object, Object> join = root.join(pathArray[0], JoinType.LEFT);
                pathT = join.get(pathArray[1]);
                for (int i = 2; i < pathArray.length; i++) {
                    pathT = pathT.get(pathArray[i]);
                }
            } else {
                pathT = root.get(pathArray[0]);
            }
            return cb.like(cb.lower(pathT), "%" + value.toLowerCase() + "%");
        };
    }

    public static <T, E extends Enum<E>> Specification<T> enumEquals(String path, E enumValue) {
        String[] pathArray = path.split("\\.");
        return (root, query, cb) -> {
            Path<Object> pathT;
            if (pathArray.length > 1) {
                Join<Object, Object> join = root.join(pathArray[0], JoinType.LEFT);
                pathT = join.get(pathArray[1]);
                for (int i = 2; i < pathArray.length; i++) {
                    pathT = pathT.get(pathArray[i]);
                }
            } else {
                pathT = root.get(pathArray[0]);
            }
            return cb.equal(pathT, enumValue);
        };
    }

    public static <T> Specification<T> equals(String path, Long value) {
        String[] pathArray = path.split("\\.");
        return (root, query, cb) -> {
            Path<Long> pathT;
            if (pathArray.length > 1) {
                Join<Object, Object> join = root.join(pathArray[0], JoinType.LEFT);
                pathT = join.get(pathArray[1]);
                for (int i = 2; i < pathArray.length; i++) {
                    pathT = pathT.get(pathArray[i]);
                }
            } else {
                pathT = root.get(pathArray[0]);
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
            Path<Boolean> pathT;
            if (pathArray.length > 1) {
                Join<Object, Object> join = root.join(pathArray[0], JoinType.LEFT);
                pathT = join.get(pathArray[1]);
                for (int i = 2; i < pathArray.length; i++) {
                    pathT = pathT.get(pathArray[i]);
                }
            } else {
                pathT = root.get(pathArray[0]);
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
