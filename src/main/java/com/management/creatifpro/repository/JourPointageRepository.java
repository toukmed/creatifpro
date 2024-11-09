package com.management.creatifpro.repository;

import com.management.creatifpro.entity.JourPointageEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface JourPointageRepository extends JpaRepository<JourPointageEntity, Long> {

    List<JourPointageEntity> findAll(Specification<JourPointageEntity> specs);


    @Query(value = "SELECT EXISTS (SELECT 1 FROM jour_pointages WHERE jour_pointage = :jourPointage AND pointage_id = :pointageId)", nativeQuery = true)
    Boolean isExistByDateAndPointageId(LocalDate jourPointage, Long pointageId);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM jour_pointages AS jp INNER JOIN pointages AS p ON jp.pointage_id = p.id \n" +
            "WHERE p.employe_id = :id AND jp.jour_pointage = :date)", nativeQuery = true)
    boolean isExistByEmployeIdAndJourPointage(@Param("id") Long id, LocalDate date);

    @Query(value = "SELECT * FROM jour_pointages WHERE jour_pointage BETWEEN :startDate AND :endDate AND pointage_id = :id", nativeQuery = true)
    List<JourPointageEntity> findAllByPointageId(@Param("id") Long id, LocalDate startDate, LocalDate endDate);


    @Query(value = "SELECT * FROM jour_pointages jp WHERE jp.jour_pointage = :date AND jp.pointage_id = :id", nativeQuery = true)
    Optional<JourPointageEntity> findByPointageIdAndJourPointage(Long id, LocalDate date);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM jour_pointages jp WHERE jp.jour_pointage = :date AND jp.pointage_id = :id)", nativeQuery = true)
    boolean isExistByPointageIdAndJourPointage(Long id, LocalDate date);
}
