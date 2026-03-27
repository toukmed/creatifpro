package com.management.creatifpro.projects.models.entities;

import com.management.creatifpro.common.entities.BaseEntity;
import com.management.creatifpro.projects.models.enums.EtatProjet;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "PROJECTS")
public class ProjectEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "CODE")
    private String code;
    @Column(name = "REFERENCE")
    private String reference;
    @Column(name = "CLIENT")
    private String client;
    @Column(name = "N_BC")
    private String nBc;
    @Column(name = "DESIGNATION")
    private String designation;
    @Enumerated(EnumType.STRING)
    @Column(name = "ETAT_PROJET")
    private EtatProjet etatProjet;

}
