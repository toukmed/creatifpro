package com.management.creatifpro.repository;

import com.management.creatifpro.entity.EmployeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeRepository extends JpaRepository<EmployeEntity, Long> {

    Page<EmployeEntity> findAll(Specification<EmployeEntity> specs, Pageable pageable);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM employes WHERE cin = :cin)", nativeQuery = true)
    boolean existsByCin(@Param("cin") String cin);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM employes WHERE cin = :cin and id <> :id)", nativeQuery = true)
    boolean existsByCinAndNotTheSameEmploye(@Param("cin") String cin, @Param("id") Long id);
}
