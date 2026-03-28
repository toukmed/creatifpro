package com.management.creatifpro.stock.models.entities;

import com.management.creatifpro.common.entities.BaseEntity;
import com.management.creatifpro.stock.models.enums.UniteProduit;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "NOM_COMPLET")
    private String nomComplet;

    @Column(name = "NOM_PRODUIT")
    private String nomProduit;

    @Column(name = "TYPE_PRODUIT")
    private String typeProduit;

    @Enumerated(EnumType.STRING)
    @Column(name = "UNITE_PRODUIT")
    private UniteProduit uniteProduit;

    @Column(name = "POIDS")
    private Double poids;

    @Column(name = "QUANTITE")
    private Double quantite;

    @Column(name = "CHANTIER")
    private String chantier;
}
