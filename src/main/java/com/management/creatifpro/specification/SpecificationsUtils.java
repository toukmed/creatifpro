package com.management.creatifpro.specification;

import com.management.creatifpro.entity.JourPointageEntity;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
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

    public static <T> Specification<T> equals(String path, Long value) {
        String[] pathArray = path.split("\\.");
        return (root, query, cb) -> {
            Path<String> pathT = root.get(pathArray[0]);
            for (String p : Arrays.stream(pathArray).skip(1).toList()) {
                pathT = pathT.get(p);
            }

            return cb.equal(cb.lower(pathT), value);
        };
    }

    public static <T> Specification<T> betweenValues(LocalDate startDate, LocalDate endDate) {
        return (root, query, cb) -> {
            // Join to JourPointageEntity list
            root.fetch("pointages");

            // Create a subquery to filter based on jourPointage date range
            Subquery<JourPointageEntity> subquery = query.subquery(JourPointageEntity.class);
            Root<JourPointageEntity> jourPointageRoot = subquery.from(JourPointageEntity.class);
            subquery.select(jourPointageRoot);

            // Define the join condition
            subquery.where(cb.and(
                    cb.equal(jourPointageRoot.get("pointageEntity"), root),
                    cb.between(jourPointageRoot.get("jourPointage"), startDate, endDate)
            ));

            // Correlate the subquery with the outer query
            return cb.exists(subquery);
        };
    }
}
