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
    @Column(nullable = false)
    private boolean status;
    @Column(nullable = false)
    private String commentaire;
    @ManyToOne
    @JoinColumn(name = "pointage_id")
    private PointageEntity pointageEntity;

}
