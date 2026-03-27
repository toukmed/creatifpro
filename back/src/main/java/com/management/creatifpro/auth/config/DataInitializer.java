package com.management.creatifpro.auth.config;

import com.management.creatifpro.auth.models.entities.UserEntity;
import com.management.creatifpro.auth.models.enums.Role;
import com.management.creatifpro.auth.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByLogin("admin").isEmpty()) {
                UserEntity admin = UserEntity.builder()
                        .firstName("Toukrichte")
                        .lastName("Mohamed")
                        .email("toukrichtemed@gmail.com")
                        .login("admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN)
                        .build();

                userRepository.save(admin);
                log.info("Default admin user created (login: admin)");
            } else {
                log.info("Admin user already exists, skipping initialization");
            }
        };
    }
}

