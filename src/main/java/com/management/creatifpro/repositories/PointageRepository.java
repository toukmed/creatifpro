package com.management.creatifpro.repositories;

import com.management.creatifpro.models.entities.PointageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PointageRepository extends JpaRepository<PointageEntity, Long> {

    Page<PointageEntity> findAll(Specification<PointageEntity> specs, Pageable pageable);

    List<PointageEntity> findAll(Specification<PointageEntity> specs);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM POINTAGES WHERE EMPLOYEE_ID = :employeeId AND POINTAGE_DATE = :pointageDate)", nativeQuery = true)
    boolean exist(
            @Param("employeeId") Long employeeId,
            @Param("pointageDate") LocalDate pointageDate);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM pointages WHERE employe_id = :id)", nativeQuery = true)
    boolean isExistByEmployeId(@Param("id") Long id);

    @Query(value = "SELECT * FROM pointages WHERE employe_id = :id", nativeQuery = true)
    Optional<PointageEntity> findByEmployeId(@Param("id") Long id);
}
