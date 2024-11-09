package com.management.creatifpro.service;

import com.management.creatifpro.dto.EmployeDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.entity.EmployeEntity;
import com.management.creatifpro.entity.PointageEntity;
import com.management.creatifpro.exception.AppException;
import com.management.creatifpro.mapper.EmployeMapper;
import com.management.creatifpro.repository.EmployeRepository;
import com.management.creatifpro.repository.PointageRepository;
import com.management.creatifpro.specification.SpecificationsUtils;
import com.management.creatifpro.util.ContratEmploye;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class EmployeService implements GenericService<EmployeEntity, SearchDto, EmployeDto>{

    private final EmployeRepository employeRepository;
    private final PointageRepository pointageRepository;
    private final EmployeMapper employeMapper;

    @Override
    public Page<EmployeDto> findAll(SearchDto searchDto) {
        Pageable pageable = PageRequest
                .of(searchDto.page().orElse(0), searchDto.size().orElse(10))
                .withSort(searchDto.sort().orElse(Sort.by(Sort.Direction.ASC, "nom")));

        return buildFilterStream(searchDto)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::and)
                .map(specs -> employeMapper.toDtoPage(employeRepository.findAll(specs, pageable), pageable))
                .orElseGet(() -> employeMapper.toDtoPage(employeRepository.findAll(pageable), pageable));
    }

    @Transactional
    public EmployeDto create(EmployeDto employeDto) {
        validateContratEmploye(employeDto);
        validateEmployeExistance(employeDto.cin());
        EmployeEntity savedEmploye = employeRepository.save(employeMapper.toEntity(employeDto));
        pointageRepository.save(PointageEntity
                .builder()
                .employe(savedEmploye)
                .build());
        return employeMapper.toDto(savedEmploye);
    }

    @Transactional
    @Override
    public EmployeDto update(EmployeDto employeDto) {

        validateEmploye(employeDto);

        EmployeEntity existingEmploye = employeRepository
                .findById(employeDto.id())
                .orElseThrow(() -> new AppException("Employe with id: " + employeDto.id() + " not found", HttpStatus.NOT_FOUND));

        EmployeEntity newEmploye = employeMapper.toEntity(employeDto);

        return employeMapper
                .toDto(employeRepository
                        .save(employeMapper.copyContent(newEmploye, existingEmploye)));
    }

    @Override
    public EmployeDto findById(Long id) {
        return employeMapper.toDto(employeRepository
                .findById(id)
                .orElseThrow(() -> new AppException("Employe with id: " + id + " not found", HttpStatus.NOT_FOUND)));
    }

    @Override
    public Stream<Optional<Specification<EmployeEntity>>> buildFilterStream(SearchDto searchDto) {
        Optional<Specification<EmployeEntity>> projetSpec = searchDto.projet()
                .map(value -> SpecificationsUtils.likeValue("projet.reference", value));
        Optional<Specification<EmployeEntity>> nomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("nom", value));
        Optional<Specification<EmployeEntity>> prenomSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("prenom", value));
        Optional<Specification<EmployeEntity>> cinSpec = searchDto.libelle()
                .map(value -> SpecificationsUtils.likeValue("cin", value));
        Optional<Specification<EmployeEntity>> typeContratSpec = searchDto.typeContrat()
                .map(value -> SpecificationsUtils.enumEquals("typeContrat", !value.isEmpty() ? ContratEmploye.valueOf(value): null));
        return Stream.of(nomSpec,prenomSpec, cinSpec, projetSpec, typeContratSpec);
    }

    private void validateEmploye(EmployeDto employeDto){
        if(employeDto.id() == null) {
            throw new AppException("L'id de l'employé est obligatoire'", HttpStatus.BAD_REQUEST);
        }
        if (employeRepository.existsByCinAndNotTheSameEmploye(employeDto.cin(), employeDto.id())) {
            throw new AppException("L'employé ayant le CIN:" + employeDto.cin() + " existe déjà", HttpStatus.BAD_REQUEST);
        }
        validateContratEmploye(employeDto);
    }

    private void validateContratEmploye(EmployeDto employeDto) {
        switch (employeDto.typeContrat()) {
            case HORAIRE -> {
                if (employeDto.tarifJournalier() == null)
                    throw new AppException("Le tarif journalier est obligatoire", HttpStatus.BAD_REQUEST);
                if (employeDto.salaireMensuel() != null)
                    throw new AppException("Le salaire mensuel ne peux pas s'affecter au employés horaires", HttpStatus.BAD_REQUEST);
            }
            case CDD, CDI -> {
                if (employeDto.tarifJournalier() != null)
                    throw new AppException("Le tarif journalier ne peux pas s'affecter au employés CDD/CDI", HttpStatus.BAD_REQUEST);
                if (employeDto.salaireMensuel() == null)
                    throw new AppException("Le salaire mensuel est obligatoire", HttpStatus.BAD_REQUEST);
            }
        }
    }

    private void validateEmployeExistance(String cin) {
        if (employeRepository.existsByCin(cin)) {
            throw new AppException("L'employé ayant le CIN:" + cin + " existe déjà", HttpStatus.BAD_REQUEST);
        }
    }
}
