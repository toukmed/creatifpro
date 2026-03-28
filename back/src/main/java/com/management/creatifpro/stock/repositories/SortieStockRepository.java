package com.management.creatifpro.stock.repositories;

import com.management.creatifpro.stock.models.entities.SortieStockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SortieStockRepository extends JpaRepository<SortieStockEntity, Long> {

    @Query("SELECT COALESCE(SUM(s.quantite), 0) FROM SortieStockEntity s WHERE s.produit.id = :produitId")
    Double sumQuantiteByProduitId(@Param("produitId") Long produitId);
}
