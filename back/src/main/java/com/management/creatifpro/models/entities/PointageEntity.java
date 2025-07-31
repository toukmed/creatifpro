package com.management.creatifpro.models.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import lombok.ToString;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "POINTAGES")
@ToString
public class PointageEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "PROJECT_ID")
    private ProjectEntity project;
    @ManyToOne
    @JoinColumn(name = "EMPLOYEE_ID")
    private EmployeeEntity employee;
    @Column(name = "POINTAGE_DATE")
    private LocalDate pointageDate;
    @Column(name = "TOTAL_HOURS")
    private Float totalHours;
    @Column(name = "IS_PAID")
    private boolean paid;
    @Column(name = "COMMENT")
    private String comment;
}
