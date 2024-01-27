package com.management.creatifpro.mapper;

import com.management.creatifpro.dto.RegistrationDto;
import com.management.creatifpro.dto.UserDto;
import com.management.creatifpro.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserDto toUserDto(UserEntity userEntity);

    @Mapping(target = "password", ignore = true)
    UserEntity toUserEntity(RegistrationDto registrationDto);
}
