package com.management.creatifpro.dto;

import lombok.Builder;
import org.springframework.data.domain.Sort;

import java.util.Optional;

@Builder
public record SearchDto(
        Optional<String> libelle,
        Optional<String> weekStartDate,
        Optional<String> weekEndDate,
        Optional<Integer> page,
        Optional<Integer> size,
        Optional<Sort> sort) implements GenericDto { }
