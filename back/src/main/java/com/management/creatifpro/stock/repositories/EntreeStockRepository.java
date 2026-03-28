package com.management.creatifpro.stock.repositories;

import com.management.creatifpro.stock.models.entities.EntreeStockEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EntreeStockRepository extends JpaRepository<EntreeStockEntity, Long> {
}
