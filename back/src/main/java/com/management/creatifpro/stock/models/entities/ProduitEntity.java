package com.management.creatifpro.stock.models.entities;

import com.management.creatifpro.common.entities.BaseEntity;
import com.management.creatifpro.stock.models.enums.TypeProduit;
import com.management.creatifpro.stock.models.enums.UniteProduit;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "PRODUITS")
public class ProduitEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "NOM_PRODUIT", nullable = false)
    private String nomProduit;

    @Enumerated(EnumType.STRING)
    @Column(name = "TYPE_PRODUIT", nullable = false)
    private TypeProduit typeProduit;

    @Enumerated(EnumType.STRING)
    @Column(name = "UNITE_PRODUIT", nullable = false)
    private UniteProduit uniteProduit;

    @Column(name = "SEUIL_ALERTE")
    private Double seuilAlerte;

    @Column(name = "DESCRIPTION")
    private String description;
}

