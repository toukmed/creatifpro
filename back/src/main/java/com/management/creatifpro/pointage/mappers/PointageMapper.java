package com.management.creatifpro.pointage.mappers;

import com.management.creatifpro.employees.mappers.EmployeeMapper;
import com.management.creatifpro.common.exceptions.AppException;
import com.management.creatifpro.employees.models.dtos.EmployeeRequestDto;
import com.management.creatifpro.projects.models.dtos.ProjectRequestDto;
import com.management.creatifpro.pointage.models.entities.PointageEntity;
import com.management.creatifpro.projects.mappers.ProjectMapper;
import com.management.creatifpro.employees.repositories.EmployeeRepository;
import com.management.creatifpro.projects.repositories.ProjectRepository;
import com.management.creatifpro.pointage.models.dtos.PointageResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static com.management.creatifpro.common.utils.CreatifUtils.DATE_FORMATTER;

@Component
@RequiredArgsConstructor
public class PointageMapper {

    private final EmployeeMapper employeeMapper;
    private final ProjectMapper projectMapper;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;

    public PointageResponseDto toDto(PointageEntity entity) {
        return PointageResponseDto
                .builder()
                .id(entity.getId())
                .employee(employeeMapper.toDto(entity.getEmployee()))
                .project(projectMapper.toDto(entity.getProject()))
                .pointageDate(entity.getPointageDate().getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.FRANCE) + " " + entity.getPointageDate().format(DATE_FORMATTER))
                .comment(entity.getComment())
                .workedDays(entity.getWorkedDays())
                .isPaid(entity.isPaid())
                .build();
    }

    public PointageEntity toEntity(ProjectRequestDto project, EmployeeRequestDto employee, LocalDate pointageDate, Float workedDays, String comment, Boolean isPaid) {
        return PointageEntity
                .builder()
                .pointageDate(pointageDate)
                .workedDays(workedDays)
                .comment(comment)
                .paid(isPaid != null && isPaid)
                .employee(employeeRepository
                        .findById(employee.id())
                        .orElseThrow(() -> new AppException("Employe with id: " + employee.id() + " not found", HttpStatus.NOT_FOUND)))
                .project(projectRepository.findById(project.id())
                        .orElseThrow(() -> new AppException("Project with id: " + project.id() + " not found", HttpStatus.NOT_FOUND)))
                .build();
    }

    public Page<PointageResponseDto> toDtoPage(Page<PointageEntity> entitiesPage, Pageable pageable){
        return new PageImpl<>(toDtoList(entitiesPage.getContent()), pageable, entitiesPage.getTotalElements());
    }

    public List<PointageResponseDto> toDtoList(List<PointageEntity> entitiesList){
        if(entitiesList == null) return List.of();
        return entitiesList
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
