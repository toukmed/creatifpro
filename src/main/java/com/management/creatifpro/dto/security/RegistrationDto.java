package com.management.creatifpro.dto.security;

public record RegistrationDto(String firstName, String lastName, String login, char[] password) {
}
