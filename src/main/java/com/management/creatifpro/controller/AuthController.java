package com.management.creatifpro.controller;

import com.management.creatifpro.configuration.security.UserAuthProvider;
import com.management.creatifpro.dto.security.CredentialDto;
import com.management.creatifpro.dto.security.RegistrationDto;
import com.management.creatifpro.dto.security.UserDto;
import com.management.creatifpro.service.security.UserService;
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

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody CredentialDto credentialDto) {
        UserDto userDto = userService.login(credentialDto);
        userDto.setToken(userAuthProvider.createToken(userDto));
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegistrationDto registrationDto) {
        UserDto userDto = userService.register(registrationDto);
        userDto.setToken(userAuthProvider.createToken(userDto));
        return ResponseEntity.created(URI.create("/users/"+userDto.getId())).body(userDto);
    }
}
