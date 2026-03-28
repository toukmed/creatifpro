package com.management.creatifpro.pointage.repositories;

import com.management.creatifpro.pointage.models.entities.PointageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PointageRepository extends JpaRepository<PointageEntity, Long>, JpaSpecificationExecutor<PointageEntity> {

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM PointageEntity p WHERE p.employee.id = :employeeId AND p.pointageDate = :pointageDate")
    boolean exist(@Param("employeeId") Long employeeId, @Param("pointageDate") LocalDate pointageDate);

    @Query("SELECT p.pointageDate FROM PointageEntity p WHERE p.employee.id IN :employeeIds AND p.pointageDate BETWEEN :start AND :end")
    List<LocalDate> findExistingDates(@Param("employeeIds") List<Long> employeeIds, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(p.workedDays), 0) FROM PointageEntity p WHERE p.employee.id = :employeeId AND p.pointageDate BETWEEN :start AND :end")
    Float sumWorkedDaysByEmployeeAndDateRange(@Param("employeeId") Long employeeId, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(p.workedDays), 0) FROM PointageEntity p WHERE p.employee.id = :employeeId")
    Float sumWorkedDaysByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT p FROM PointageEntity p WHERE p.employee.id = :employeeId AND p.pointageDate BETWEEN :start AND :end ORDER BY p.pointageDate ASC")
    List<PointageEntity> findByEmployeeIdAndDateRange(@Param("employeeId") Long employeeId, @Param("start") LocalDate start, @Param("end") LocalDate end);
}
