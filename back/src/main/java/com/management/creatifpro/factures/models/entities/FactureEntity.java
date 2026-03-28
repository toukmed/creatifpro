package com.management.creatifpro.factures.models.entities;

import com.management.creatifpro.common.entities.BaseEntity;
import com.management.creatifpro.factures.models.enums.EtatPaiement;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
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
@Table(name = "FACTURES")
public class FactureEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NUM_FACTURE")
    private String numFacture;

    @Column(name = "N_BC")
    private String nBc;

    @Column(name = "MONTANT_TTC")
    private String montantTtc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PROJECT_ID")
    private ProjectEntity project;

    @Column(name = "DATE_FACTURE")
    private LocalDate dateFacture;

    @Enumerated(EnumType.STRING)
    @Column(name = "ETAT_PAIEMENT")
    private EtatPaiement etatPaiement;

    @Column(name = "DATE_PAIEMENT")
    private LocalDate datePaiement;
}

