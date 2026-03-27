package com.management.creatifpro.auth.models.dtos;

import jakarta.validation.constraints.NotBlank;

public record CredentialDto(
        @NotBlank(message = "L'identifiant est requis")
        String login,
        @NotBlank(message = "Le mot de passe est requis")
        char[] password
) {
}
