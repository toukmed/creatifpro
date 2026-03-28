package com.management.creatifpro.stock.repositories;

import com.management.creatifpro.stock.models.entities.EntreeStockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntreeStockRepository extends JpaRepository<EntreeStockEntity, Long> {

    List<EntreeStockEntity> findAllByProduitId(Long produitId);

    @Query("SELECT COALESCE(SUM(e.quantite), 0) FROM EntreeStockEntity e WHERE e.produit.id = :produitId")
    Double sumQuantiteByProduitId(@Param("produitId") Long produitId);

    @Query("SELECT e FROM EntreeStockEntity e WHERE e.produit.id = :produitId ORDER BY e.dateEntree DESC")
    List<EntreeStockEntity> findLatestByProduitId(@Param("produitId") Long produitId);
}
