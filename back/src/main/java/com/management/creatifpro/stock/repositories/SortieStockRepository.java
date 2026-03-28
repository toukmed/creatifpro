package com.management.creatifpro.stock.repositories;

import com.management.creatifpro.stock.models.entities.SortieStockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SortieStockRepository extends JpaRepository<SortieStockEntity, Long> {
}
