package com.management.creatifpro.service;

import com.management.creatifpro.dto.CredentialDto;
import com.management.creatifpro.dto.RegistrationDto;
import com.management.creatifpro.dto.UserDto;
import com.management.creatifpro.entity.UserEntity;
import com.management.creatifpro.exception.AppException;
import com.management.creatifpro.mapper.UserMapper;
import com.management.creatifpro.repository.UserRepository;
import com.management.creatifpro.specification.SpecificationsUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserDto login(CredentialDto credentialDto) {
        UserEntity userDto = userRepository
                .findByLogin(credentialDto.login())
                .orElseThrow(() -> new AppException("UNKNOWN_USER", HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(CharBuffer.wrap(credentialDto.password()), userDto.getPassword())) {
            return userMapper.toUserDto(userDto);
        }
        throw new AppException("INVALID_PASSWORD", HttpStatus.BAD_REQUEST);
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

            return userMapper.toUserDto(userRepository.save(userEntity));
        } else {
            throw new AppException("USER_ALREADY_EXISTS", HttpStatus.BAD_REQUEST);
        }
    }

    private Optional<UserEntity> findUser(RegistrationDto registrationDto) {

        Optional<Specification<UserEntity>> firstNameSpec =
                Optional.of(SpecificationsUtils.likeValue("firstName", registrationDto.firstName()));
        Optional<Specification<UserEntity>> lastNameSpec =
                Optional.of(SpecificationsUtils.likeValue("lastName", registrationDto.firstName()));
        Optional<Specification<UserEntity>> loginSpec =
                Optional.of(SpecificationsUtils.likeValue("login", registrationDto.firstName()));

        Specification<UserEntity> specs = Stream.of(firstNameSpec, lastNameSpec, loginSpec)
                .map(Optional::get)
                .reduce(Specification::or)
                .orElse(null);

        return userRepository.findOne(specs);
    }
}
