package com.management.creatifpro.auth.mappers;

import com.management.creatifpro.auth.models.dtos.UserDto;
import com.management.creatifpro.auth.models.entities.UserEntity;
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
