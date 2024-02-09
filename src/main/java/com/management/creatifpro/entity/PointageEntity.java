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
@Table(name = "pointages")
public class PointageEntity extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "employe_id")
    private EmployeEntity employe;
    @OneToMany(mappedBy = "pointageEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JourPointageEntity> pointages;
}
