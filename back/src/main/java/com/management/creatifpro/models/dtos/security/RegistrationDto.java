package com.management.creatifpro.models.dtos.security;

public record RegistrationDto(String firstName, String lastName, String login, char[] password) {
}
