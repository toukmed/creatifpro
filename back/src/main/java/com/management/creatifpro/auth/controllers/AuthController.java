package com.management.creatifpro.auth.controllers;

import com.management.creatifpro.auth.models.dtos.CredentialDto;
import com.management.creatifpro.auth.models.dtos.RegistrationDto;
import com.management.creatifpro.auth.models.dtos.UserDto;
import com.management.creatifpro.auth.services.security.UserService;
import com.management.creatifpro.security.UserAuthProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserAuthProvider userAuthProvider;

    @PostMapping("/api/login")
    public ResponseEntity<UserDto> login(@RequestBody @Valid CredentialDto credentialDto) {
        UserDto userDto = userService.login(credentialDto);
        userDto.setToken(userAuthProvider.createToken(userDto));
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/api/register")
    public ResponseEntity<UserDto> register(@RequestBody @Valid RegistrationDto registrationDto) {
        UserDto userDto = userService.register(registrationDto);
        userDto.setToken(userAuthProvider.createToken(userDto));
        return ResponseEntity.created(URI.create("/users/" + userDto.getId())).body(userDto);
    }
}
