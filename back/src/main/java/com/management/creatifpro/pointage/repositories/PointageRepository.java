package com.management.creatifpro.pointage.repositories;

import com.management.creatifpro.pointage.models.entities.PointageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface PointageRepository extends JpaRepository<PointageEntity, Long>, JpaSpecificationExecutor<PointageEntity> {

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM PointageEntity p WHERE p.employee.id = :employeeId AND p.pointageDate = :pointageDate")
    boolean exist(@Param("employeeId") Long employeeId, @Param("pointageDate") LocalDate pointageDate);
}
