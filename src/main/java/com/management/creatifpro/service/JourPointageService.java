package com.management.creatifpro.service;

import com.management.creatifpro.dto.JourPointageDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.entity.JourPointageEntity;
import com.management.creatifpro.mapper.JourPointageMapper;
import com.management.creatifpro.repository.JourPointageRepository;
import com.management.creatifpro.repository.PointageRepository;
import com.management.creatifpro.specification.SpecificationsUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static com.management.creatifpro.util.CreatifUtils.DATE_FORMATTER;

@Service
@RequiredArgsConstructor
@Slf4j
public class JourPointageService implements GenericService<JourPointageEntity, SearchDto, JourPointageDto> {

    private final JourPointageRepository jourPointageRepository;
    private final PointageRepository pointageRepository;
    private final JourPointageMapper jourPointageMapper;


    public List<JourPointageDto> listAll(SearchDto searchDto) {
        if (searchDto.idPointage().isPresent() && searchDto.startDate().isPresent() && searchDto.endDate().isPresent()) {
            return jourPointageMapper.toDtoList(jourPointageRepository.findAllByEmployeId(
                    searchDto.idPointage().get(),
                    LocalDate.parse(searchDto.startDate().get(), DATE_FORMATTER),
                    LocalDate.parse(searchDto.endDate().get(), DATE_FORMATTER)));
        }

        return jourPointageMapper.toDtoList(List.of());
    }

    @Override
    public Page<JourPointageDto> findAll(SearchDto searchDto) {
        return null;
    }

    @Override
    public JourPointageDto update(JourPointageDto dto) {
        Optional<JourPointageEntity> toUpdate = jourPointageRepository.findById(dto.id());
        if (toUpdate.isPresent()) {
            JourPointageEntity toUpdateEntity = toUpdate.get();
            toUpdateEntity.setCommentaire(dto.commentaire());
            toUpdateEntity.setPointage(dto.pointage());
            toUpdateEntity.setStatus(dto.status());

            return jourPointageMapper.toDto(jourPointageRepository.save(toUpdateEntity));
        }
        return null;
    }

    @Override
    public JourPointageDto findById(Long id) {
        return null;
    }

    public JourPointageDto findByIdAndJourPointage(Long id, String jourPointage) {
        return jourPointageMapper
                .toDto(jourPointageRepository
                        .findByPointageIdAndJourPointage(id, LocalDate.parse(jourPointage, DATE_FORMATTER)).orElse(null));
    }

    @Override
    public Stream<Optional<Specification<JourPointageEntity>>> buildFilterStream(SearchDto searchDto) {
        Optional<Specification<JourPointageEntity>> idEmployeSpec = searchDto.idPointage()
                .map(value -> SpecificationsUtils.equals("pointage.employe.id", value));
        Optional<Specification<JourPointageEntity>> dateRangeSpec = searchDto.startDate()
                .map(value -> SpecificationsUtils.betweenValues(LocalDate.parse(searchDto.startDate().get(), DATE_FORMATTER), LocalDate.parse(searchDto.endDate().get(), DATE_FORMATTER)));

        return Stream.of(idEmployeSpec, dateRangeSpec);
    }

    @Transactional
    public JourPointageDto create(JourPointageDto dto) {
        if (!jourPointageRepository.isExistByPointageIdAndJourPointage(dto.idPointage(), LocalDate.parse(dto.jourPointage(), DATE_FORMATTER))) {
            JourPointageEntity toCreate = JourPointageEntity
                    .builder()
                    .status(dto.status())
                    .commentaire(dto.commentaire())
                    .pointage(dto.pointage())
                    .pointageEntity(pointageRepository.findById(dto.idPointage()).orElse(null))
                    .jourPointage(LocalDate.parse(dto.jourPointage(), DATE_FORMATTER))
                    .build();
            return jourPointageMapper.toDto(jourPointageRepository.save(toCreate));
        }
        return null;
    }

    private void checkExistanceOfJourPointage(Long id, LocalDate date) {
        if (jourPointageRepository.findByPointageIdAndJourPointage(id, date).isPresent()) {
        }
    }

    public boolean isExistByPointageIdAndJourPointage(Long id, String date) {
        return jourPointageRepository.isExistByPointageIdAndJourPointage(id, LocalDate.parse(date, DATE_FORMATTER));
    }

}
