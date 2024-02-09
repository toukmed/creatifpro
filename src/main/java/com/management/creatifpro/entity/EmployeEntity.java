package com.management.creatifpro.entity;

import com.management.creatifpro.util.ContratEmploye;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "employes")
public class EmployeEntity extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nom;
    @Column(nullable = false)
    private String prenom;
    @Column(name = "date_integration", nullable = false)
    private LocalDate dateIntegration;
    @Column(nullable = false)
    private String cin;
    @Column(name = "numero_telephone")
    private String numeroTelephone;
    @Column(name = "type_contrat", nullable = false)
    @Enumerated(EnumType.STRING)
    private ContratEmploye typeContrat;
    private String poste;
    @Column(name = "tarif_journalier")
    private Long tarifJournalier;
    @Column(name = "salaire_mensuel")
    private Long salaireMensuel;
    @ManyToOne
    @JoinColumn(name = "projet_affecte_id")
    private ProjetEntity projet;

}
