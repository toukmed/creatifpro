package com.management.creatifpro.mappers.security;

import com.management.creatifpro.models.dtos.security.UserDto;
import com.management.creatifpro.models.entities.security.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {


    public UserDto toDto(UserEntity entity) {
        return UserDto
                .builder()
                .id(entity.getId())
                .login(entity.getLogin())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .build();
    }

}
