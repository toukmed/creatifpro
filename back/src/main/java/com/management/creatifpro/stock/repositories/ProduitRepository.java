package com.management.creatifpro.stock.repositories;

import com.management.creatifpro.stock.models.entities.ProduitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepository extends JpaRepository<ProduitEntity, Long> {
    boolean existsByNomProduit(String nomProduit);
}

