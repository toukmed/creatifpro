package com.management.creatifpro.repository;

import com.management.creatifpro.entity.ProjetEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjetRepository extends JpaRepository<ProjetEntity, Long> {

    Page<ProjetEntity> findAll(Specification<ProjetEntity> specs, Pageable pageable);
}
