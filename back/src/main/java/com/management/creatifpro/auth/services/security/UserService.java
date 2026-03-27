package com.management.creatifpro.auth.services.security;

import com.management.creatifpro.auth.mappers.UserMapper;
import com.management.creatifpro.auth.models.dtos.CredentialDto;
import com.management.creatifpro.auth.models.dtos.RegistrationDto;
import com.management.creatifpro.auth.models.dtos.UserDto;
import com.management.creatifpro.auth.models.entities.UserEntity;
import com.management.creatifpro.auth.models.enums.Role;
import com.management.creatifpro.auth.repository.UserRepository;
import com.management.creatifpro.common.exceptions.AppException;
import com.management.creatifpro.common.specifications.SecuritySpecificationsUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public List<UserDto> findAll() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    public UserDto login(CredentialDto credentialDto) {
        UserEntity user = userRepository
                .findByLogin(credentialDto.login())
                .orElseThrow(() -> new AppException("User with login: " + credentialDto.login() + " not found", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialDto.password()), user.getPassword())) {
            return userMapper.toDto(user);
        }
        throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public UserDto register(RegistrationDto registrationDto) {

        if (findUser(registrationDto).isEmpty()) {

            Role targetRole = parseRole(registrationDto.role());
            Role currentUserRole = getCurrentUserRole();

            if (currentUserRole != null && !currentUserRole.canAssign(targetRole)) {
                throw new AppException(
                        "Vous n'avez pas la permission d'assigner le rôle " + targetRole.name(),
                        HttpStatus.FORBIDDEN
                );
            }

            UserEntity userEntity = UserEntity
                    .builder()
                    .firstName(registrationDto.prenom())
                    .lastName(registrationDto.nom())
                    .email(registrationDto.email())
                    .login(registrationDto.login())
                    .password(passwordEncoder.encode(CharBuffer.wrap(registrationDto.password())))
                    .role(targetRole)
                    .build();

            return userMapper.toDto(userRepository.save(userEntity));
        } else {
            throw new AppException("Un utilisateur avec cet identifiant ou cet email existe déjà", HttpStatus.BAD_REQUEST);
        }
    }

    public List<String> getAssignableRoles() {
        Role currentUserRole = getCurrentUserRole();
        if (currentUserRole == null) {
            return List.of();
        }
        return currentUserRole.getAssignableRoles()
                .stream()
                .map(Role::name)
                .toList();
    }

    public void deleteById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("Utilisateur non trouvé", HttpStatus.NOT_FOUND));

        Role currentUserRole = getCurrentUserRole();
        if (currentUserRole == null || !currentUserRole.canDelete(user.getRole())) {
            throw new AppException("Vous n'avez pas la permission de supprimer cet utilisateur", HttpStatus.FORBIDDEN);
        }

        userRepository.deleteById(id);
    }

    private Role getCurrentUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDto userDto) {
            return Role.valueOf(userDto.getRole());
        }
        if (principal instanceof UserEntity userEntity) {
            return userEntity.getRole();
        }
        return null;
    }

    private Role parseRole(String roleName) {
        try {
            return Role.valueOf(roleName);
        } catch (IllegalArgumentException e) {
            throw new AppException("Rôle invalide : " + roleName, HttpStatus.BAD_REQUEST);
        }
    }

    private Optional<UserEntity> findUser(RegistrationDto registrationDto) {

        Optional<Specification<UserEntity>> loginSpec =
                Optional.of(SecuritySpecificationsUtils.likeValue("login", registrationDto.login()));
        Optional<Specification<UserEntity>> emailSpec =
                Optional.of(SecuritySpecificationsUtils.likeValue("email", registrationDto.email()));

        Specification<UserEntity> specs = Stream.of(loginSpec, emailSpec)
                .map(Optional::get)
                .reduce(Specification::or)
                .orElse(null);

        return userRepository.findOne(specs);
    }
}
