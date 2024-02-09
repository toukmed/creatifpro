package com.management.creatifpro.entity;

import jakarta.persistence.*;
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
@Table(name = "jour_pointages")
public class JourPointageEntity extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "jour_pointage", nullable = false)
    private LocalDate jourPointage;
    @Column(nullable = false)
    private Float pointage;
    @Column(name = "pointage_supplementaire")
    private Float pointageSupplementaire;
    @Column(name = "projet_id", nullable = false)
    private Long projetId;
    @ManyToOne
    @JoinColumn(name = "employe_id")
    private EmployeEntity employe;
    @ManyToOne
    @JoinColumn(name = "pointage_id")
    private PointageEntity pointageEntity;

}
