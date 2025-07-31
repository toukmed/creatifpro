package com.management.creatifpro.repositories;

import com.management.creatifpro.models.entities.ProjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

    Page<ProjectEntity> findAll(Specification<ProjectEntity> specs, Pageable pageable);

    Optional<ProjectEntity> findByReference(String reference);
}
