package com.management.creatifpro.repository;

import com.management.creatifpro.entity.JourPointageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface JourPointageRepository extends JpaRepository<JourPointageEntity, Long> {

    @Query(value = "SELECT EXISTS (SELECT 1 FROM jour_pointages WHERE jour_pointage = :jourPointage AND pointage_id = :pointageId)", nativeQuery = true)
    Boolean isExistByDateAndPointageId(LocalDate jourPointage, Long pointageId);
}
