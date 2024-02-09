package com.management.creatifpro.dto;

import lombok.Builder;
import org.springframework.data.domain.Sort;

import java.util.Optional;

@Builder
public record SearchDto(
        Optional<String> libelle,
        Optional<Integer> page,
        Optional<Integer> size,
        Optional<Sort> sort) { }
