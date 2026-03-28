package com.management.creatifpro.pointage.models.dtos;

public record EmployeePointageDto(
        Long employeeId,
        String firstName,
        String lastName,
        String cin,
        Double workedDays,
        String projet
) {}