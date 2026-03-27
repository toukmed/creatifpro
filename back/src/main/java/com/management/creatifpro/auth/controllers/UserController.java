package com.management.creatifpro.auth.controllers;

import com.management.creatifpro.auth.models.dtos.RegistrationDto;
import com.management.creatifpro.auth.models.dtos.UserDto;
import com.management.creatifpro.auth.services.security.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserDto>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<String>> getAssignableRoles() {
        return ResponseEntity.ok(userService.getAssignableRoles());
    }

    @PostMapping("/create")
    public ResponseEntity<UserDto> create(@RequestBody @Valid RegistrationDto registrationDto) {
        return ResponseEntity.ok(userService.register(registrationDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

