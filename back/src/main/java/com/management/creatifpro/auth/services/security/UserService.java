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

            UserEntity userEntity = UserEntity
                    .builder()
                    .firstName(registrationDto.prenom())
                    .lastName(registrationDto.nom())
                    .email(registrationDto.email())
                    .login(registrationDto.login())
                    .password(passwordEncoder.encode(CharBuffer.wrap(registrationDto.password())))
                    .role(Role.POINTEUR)
                    .build();

            return userMapper.toDto(userRepository.save(userEntity));
        } else {
            throw new AppException("Un utilisateur avec cet identifiant ou cet email existe déjà", HttpStatus.BAD_REQUEST);
        }
    }

    public void deleteById(Long id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new AppException("Utilisateur non trouvé", HttpStatus.NOT_FOUND));
        if (Role.ADMIN.equals(user.getRole())) {
            throw new AppException("Impossible de supprimer un administrateur", HttpStatus.BAD_REQUEST);
        }
        userRepository.deleteById(id);
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
