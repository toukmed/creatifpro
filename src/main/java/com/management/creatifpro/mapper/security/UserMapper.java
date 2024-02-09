package com.management.creatifpro.mapper.security;

import com.management.creatifpro.dto.ProjetDto;
import com.management.creatifpro.dto.security.UserDto;
import com.management.creatifpro.entity.ProjetEntity;
import com.management.creatifpro.entity.security.UserEntity;
import com.management.creatifpro.mapper.generic.GenericMapper;
import org.springframework.stereotype.Component;

@Component
public class UserMapper extends GenericMapper<UserDto, UserEntity> {


    @Override
    public UserDto toDto(UserEntity entity) {
        return UserDto
                .builder()
                .id(entity.getId())
                .login(entity.getLogin())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .build();
    }

    @Override
    public UserEntity toEntity(UserDto entityDto) {
        return null;
    }
}
