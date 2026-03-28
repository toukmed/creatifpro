package com.management.creatifpro.stock.models.entities;

import com.management.creatifpro.common.entities.BaseEntity;
import com.management.creatifpro.projects.models.entities.ProjectEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "SORTIES_STOCK")
public class SortieStockEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "PRODUIT_ID", nullable = false)
    private ProduitEntity produit;

    @Column(name = "QUANTITE", nullable = false)
    private Double quantite;

    @ManyToOne
    @JoinColumn(name = "PROJECT_ID")
    private ProjectEntity project;

    @Column(name = "DATE_SORTIE")
    private LocalDate dateSortie;

    @Column(name = "DEMANDEUR")
    private String demandeur;

    @Column(name = "REFERENCE_DOCUMENT")
    private String referenceDocument;

    @Column(name = "COMMENTAIRE")
    private String commentaire;
}
