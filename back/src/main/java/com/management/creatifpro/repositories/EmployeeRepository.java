package com.management.creatifpro.repositories;

import com.management.creatifpro.models.entities.EmployeeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long> {

    Page<EmployeeEntity> findAll(Specification<EmployeeEntity> specs, Pageable pageable);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM employes WHERE cin = :cin)", nativeQuery = true)
    boolean existsByCin(@Param("cin") String cin);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM employes WHERE cin = :cin and id <> :id)", nativeQuery = true)
    boolean existsByCinAndNotTheSameEmploye(@Param("cin") String cin, @Param("id") Long id);
}
