package com.management.creatifpro.mapper.generic;

import com.management.creatifpro.entity.BaseEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public abstract class GenericMapper<
        T,
        U extends BaseEntity> {

    protected final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public abstract T toDto(U entity);
    public abstract U toEntity(T entityDto);
    public abstract U toMinimalEntity(T entityDto);

    public Page<T> toDtoPage(Page<U> entitiesPage, Pageable pageable){
        return new PageImpl<>(toDtoList(entitiesPage.getContent()), pageable, entitiesPage.getTotalPages());
    }

    public List<T> toDtoList(List<U> entitiesList){
        if(entitiesList == null) return List.of();
        return entitiesList
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<U> toEntityList(List<T> dtos){
        if(dtos == null) return List.of();
        return dtos
                .stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

    public List<U> toMinimalEntityList(List<T> dtos){
        if(dtos == null) return List.of();
        return dtos
                .stream()
                .map(this::toMinimalEntity)
                .collect(Collectors.toList());
    }
}
