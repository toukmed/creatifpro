package com.management.creatifpro.auth.models.dtos;

public record RegistrationDto(String firstName, String lastName, String login, char[] password) {
}
