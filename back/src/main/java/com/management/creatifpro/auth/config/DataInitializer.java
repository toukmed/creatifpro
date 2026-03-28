package com.management.creatifpro.auth.config;

import com.management.creatifpro.auth.models.entities.UserEntity;
import com.management.creatifpro.auth.models.enums.Role;
import com.management.creatifpro.auth.repository.UserRepository;
import com.management.creatifpro.employees.models.entities.EmployeeEntity;
import com.management.creatifpro.employees.repositories.EmployeeRepository;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import com.management.creatifpro.projects.models.enums.EtatProjet;
import com.management.creatifpro.projects.repositories.ProjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Slf4j
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByLogin("mtoukrichte").isEmpty()) {
                UserEntity admin = UserEntity.builder()
                        .firstName("Toukrichte")
                        .lastName("Mohamed")
                        .email("toukrichtemed@gmail.com")
                        .login("mtoukrichte")
                        .password(passwordEncoder.encode("Collab@7393"))
                        .role(Role.SUPER_ADMIN)
                        .build();

                userRepository.save(admin);
                log.info("Default super admin user created (login: mtoukrichte)");
            } else {
                log.info("Super Admin user already exists, skipping initialization");
            }
        };
    }

    @Bean
    @Order(1)
    CommandLineRunner initProjects(ProjectRepository projectRepository) {
        return args -> {
            if (projectRepository.count() == 0) {
                ProjectEntity project1 = ProjectEntity.builder()
                        .code("PRJ-001")
                        .reference("REF-2026-001")
                        .client("Client Alpha")
                        .nBc("BC-001")
                        .designation("Construction Bâtiment A")
                        .etatProjet(EtatProjet.EN_COURS)
                        .build();

                ProjectEntity project2 = ProjectEntity.builder()
                        .code("PRJ-002")
                        .reference("REF-2026-002")
                        .client("Client Beta")
                        .nBc("BC-002")
                        .designation("Rénovation Bureau B")
                        .etatProjet(EtatProjet.EN_ATTENTE)
                        .build();

                projectRepository.save(project1);
                projectRepository.save(project2);
                log.info("Default projects initialized (PRJ-001, PRJ-002)");
            } else {
                log.info("Projects already exist, skipping initialization");
            }
        };
    }

    @Bean
    @Order(2)
    CommandLineRunner initEmployees(EmployeeRepository employeeRepository, ProjectRepository projectRepository) {
        return args -> {
            if (employeeRepository.count() == 0) {
                ProjectEntity project1 = projectRepository.findByReference("REF-2026-001")
                        .orElseThrow(() -> new RuntimeException("Project REF-2026-001 not found for employee initialization"));

                ProjectEntity project2 = projectRepository.findByReference("REF-2026-002")
                        .orElseThrow(() -> new RuntimeException("Project REF-2026-002 not found for employee initialization"));

                EmployeeEntity employee1 = EmployeeEntity.builder()
                        .firstName("Ahmed")
                        .lastName("Bennani")
                        .cin("AB123456")
                        .phoneNumber("0661234567")
                        .integrationDate(LocalDate.of(2025, 1, 15))
                        .jobRole("Chef de chantier")
                        .dailyRate(500.0f)
                        .salary(12000.0f)
                        .chantier("Chantier A")
                        .nCnss("CNSS-001")
                        .rib("RIB-001-XXXX")
                        .project(project1)
                        .build();

                EmployeeEntity employee2 = EmployeeEntity.builder()
                        .firstName("Youssef")
                        .lastName("El Amrani")
                        .cin("CD789012")
                        .phoneNumber("0667890123")
                        .integrationDate(LocalDate.of(2025, 3, 1))
                        .jobRole("Ouvrier qualifié")
                        .dailyRate(300.0f)
                        .salary(8000.0f)
                        .chantier("Chantier B")
                        .nCnss("CNSS-002")
                        .rib("RIB-002-XXXX")
                        .project(project2)
                        .build();

                employeeRepository.save(employee1);
                employeeRepository.save(employee2);
                log.info("Default employees initialized (Ahmed Bennani, Youssef El Amrani)");
            } else {
                log.info("Employees already exist, skipping initialization");
            }
        };
    }
}

