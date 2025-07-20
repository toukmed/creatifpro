package com.management.creatifpro.models.entities;

import com.management.creatifpro.models.enums.ContractType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "EMPLOYEES")
public class EmployeeEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    private LocalDate integrationDate;
    @Column(nullable = false)
    private String cin;
    private String phoneNumber;
    @Enumerated(EnumType.STRING)
    private ContractType contractType;
    private String jobRole;
    private Float hourlyRate;
    private Float salary;
    @ManyToOne
    @JoinColumn(name = "PROJECT_ID", nullable = false)
    private ProjectEntity project;

}
