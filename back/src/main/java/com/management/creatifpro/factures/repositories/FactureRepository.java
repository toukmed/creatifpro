package com.management.creatifpro.factures.repositories;

import com.management.creatifpro.factures.models.entities.FactureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<FactureEntity, Long> {

    Optional<FactureEntity> findByNumFacture(String numFacture);
}

