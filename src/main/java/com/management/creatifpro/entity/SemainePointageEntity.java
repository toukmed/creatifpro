package com.management.creatifpro.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "semaine_pointages")
public class SemainePointageEntity extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "date_debut_semaine", nullable = false)
    private LocalDate dateDebutPointage;
    @Column(name = "date_fin_semaine", nullable = false)
    private LocalDate dateFinPointage;
    @Column(name = "status")
    private boolean status;
    @ManyToOne
    @JoinColumn(name = "pointage_id")
    private PointageEntity pointageEntity;
    @OneToMany(mappedBy = "semainePointageEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JourPointageEntity> pointages;

}
