package com.management.creatifpro.auth.models.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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
        @NotBlank(message = "Le mot de passe est requis")
        @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
        char[] password
) {
}
