package com.management.creatifpro.repository;

import com.management.creatifpro.entity.JourPointageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JourPointageRepository extends JpaRepository<JourPointageEntity, Long> {
}
