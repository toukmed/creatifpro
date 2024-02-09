package com.management.creatifpro.repository;

import com.management.creatifpro.entity.PointageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PointageRepository extends JpaRepository<PointageEntity, Long> {

    Page<PointageEntity> findAll(Specification<PointageEntity> specs, Pageable pageable);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM pointages WHERE employe_id = :id)", nativeQuery = true)
    boolean isExistByEmployeId(@Param("id") Long id);
}
