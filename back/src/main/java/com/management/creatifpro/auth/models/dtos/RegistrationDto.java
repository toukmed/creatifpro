package com.management.creatifpro.auth.models.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record RegistrationDto(
        @NotBlank(message = "Le nom est requis")
        String nom,
        @NotBlank(message = "Le prénom est requis")
        String prenom,
        @NotBlank(message = "L'email est requis")
        @Email(message = "Format d'email invalide")
        String email,
        @NotBlank(message = "L'identifiant est requis")
        String login,
        @NotNull(message = "Le mot de passe est requis")
        char[] password,
        @NotBlank(message = "Le rôle est requis")
        String role
) {
}
