package com.management.creatifpro.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "pointages")
@ToString
public class PointageEntity extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "employe_id")
    private EmployeEntity employe;
    @OneToMany(mappedBy = "pointageEntity", cascade = CascadeType.ALL)
    private List<JourPointageEntity> pointages;
}
