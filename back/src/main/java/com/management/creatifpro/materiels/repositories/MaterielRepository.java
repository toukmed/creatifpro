package com.management.creatifpro.materiels.repositories;

import com.management.creatifpro.materiels.models.entities.MaterielEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterielRepository extends JpaRepository<MaterielEntity, Long> {

    Optional<MaterielEntity> findByReference(String reference);
}
