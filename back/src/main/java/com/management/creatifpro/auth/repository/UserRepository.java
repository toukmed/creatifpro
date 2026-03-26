package com.management.creatifpro.auth.repository;

import com.management.creatifpro.auth.models.entities.UserEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByLogin(String login);

    Optional<UserEntity> findOne(Specification<UserEntity> specs);
}
