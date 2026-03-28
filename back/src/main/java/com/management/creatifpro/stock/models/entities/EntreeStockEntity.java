package com.management.creatifpro.stock.models.entities;

import com.management.creatifpro.common.entities.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "ENTREES_STOCK")
public class EntreeStockEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "PRODUIT_ID", nullable = false)
    private ProduitEntity produit;

    @Column(name = "QUANTITE", nullable = false)
    private Double quantite;

    @Column(name = "PRIX_UNITAIRE")
    private Double prixUnitaire;

    @Column(name = "FOURNISSEUR")
    private String fournisseur;

    @Column(name = "DATE_ENTREE")
    private LocalDate dateEntree;

    @Column(name = "REFERENCE_DOCUMENT")
    private String referenceDocument;

    @Column(name = "COMMENTAIRE")
    private String commentaire;
}
