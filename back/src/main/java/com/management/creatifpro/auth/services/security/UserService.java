package com.management.creatifpro.auth.services.security;

import com.management.creatifpro.auth.mappers.UserMapper;
import com.management.creatifpro.auth.models.dtos.CredentialDto;
import com.management.creatifpro.auth.models.dtos.RegistrationDto;
import com.management.creatifpro.auth.models.dtos.UserDto;
import com.management.creatifpro.auth.models.entities.UserEntity;
import com.management.creatifpro.auth.repository.UserRepository;
import com.management.creatifpro.common.exceptions.AppException;
import com.management.creatifpro.common.specifications.SecuritySpecificationsUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

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
                    .firstName(registrationDto.firstName())
                    .lastName(registrationDto.lastName())
                    .login(registrationDto.login())
                    .password(passwordEncoder.encode(CharBuffer.wrap(registrationDto.password())))
                    .build();

            return userMapper.toDto(userRepository.save(userEntity));
        } else {
            throw new AppException("User with login: " + registrationDto.login() + " exist already", HttpStatus.BAD_REQUEST);
        }
    }

    private Optional<UserEntity> findUser(RegistrationDto registrationDto) {

        Optional<Specification<UserEntity>> firstNameSpec =
                Optional.of(SecuritySpecificationsUtils.likeValue("firstName", registrationDto.firstName()));
        Optional<Specification<UserEntity>> lastNameSpec =
                Optional.of(SecuritySpecificationsUtils.likeValue("lastName", registrationDto.lastName()));
        Optional<Specification<UserEntity>> loginSpec =
                Optional.of(SecuritySpecificationsUtils.likeValue("login", registrationDto.login()));

        Specification<UserEntity> specs = Stream.of(firstNameSpec, lastNameSpec, loginSpec)
                .map(Optional::get)
                .reduce(Specification::or)
                .orElse(null);

        return userRepository.findOne(specs);
    }
}
