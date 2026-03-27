package com.management.creatifpro.auth.models.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CredentialDto(
        @NotBlank(message = "L'identifiant est requis")
        String login,
        @NotNull(message = "Le mot de passe est requis")
        char[] password
) {
}
