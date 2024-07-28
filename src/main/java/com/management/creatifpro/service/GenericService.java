package com.management.creatifpro.service;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;

import java.util.Optional;
import java.util.stream.Stream;

public interface GenericService<T, U, V> {

    Page<V> findAll(U searchDto);
    V update(V dto);
    V findById(Long id);
    Stream<Optional<Specification<T>>> buildFilterStream( U searchDto);
}
