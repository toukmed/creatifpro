package com.management.creatifpro.repository;

import com.management.creatifpro.entity.SemainePointageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SemainePointageRepository extends JpaRepository<SemainePointageEntity, Long> {
}
