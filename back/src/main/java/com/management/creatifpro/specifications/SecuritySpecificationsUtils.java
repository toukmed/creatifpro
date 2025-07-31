package com.management.creatifpro.specifications;

import jakarta.persistence.criteria.Path;
import org.springframework.data.jpa.domain.Specification;

import java.util.Arrays;

public class SecuritySpecificationsUtils {
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
}
