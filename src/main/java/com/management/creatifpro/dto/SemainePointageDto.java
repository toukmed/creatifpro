package com.management.creatifpro.dto;

import lombok.Builder;

import java.util.List;


@Builder
public record SemainePointageDto (
        Long id,
        String dateDebutPointage,
        String dateFinPointage,
        List<JourPointageDto> jourPointages,
        boolean status){
}
