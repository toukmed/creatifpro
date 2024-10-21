package com.management.creatifpro.dto;

import lombok.Builder;
import org.springframework.data.domain.Sort;

import java.util.Optional;

@Builder
public record SearchDto(
        Optional<String> libelle,
        Optional<String> projet,
        Optional<String> startDate,
        Optional<String> endDate,
        Optional<Integer> page,
        Optional<Long> idPointage,
        Optional<Integer> size,
        Optional<Sort> sort) implements GenericDto { }
