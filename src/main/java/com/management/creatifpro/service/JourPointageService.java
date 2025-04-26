package com.management.creatifpro.service;

import com.management.creatifpro.dto.JourPointageDto;
import com.management.creatifpro.dto.PointageStatsDto;
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
            return jourPointageMapper.toDtoList(jourPointageRepository.findAllByPointageId(
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

    public List<JourPointageDto> findAll(String startDate, String endDate, Long idPointage) {
        return jourPointageMapper.toDtoList(buildFilterStream(startDate, endDate, idPointage)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .reduce(Specification::and)
                .map(jourPointageRepository::findAll)
                .orElseGet(jourPointageRepository::findAll)
        );
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

    @Override
    public Stream<Optional<Specification<JourPointageEntity>>> buildFilterStream(SearchDto searchDto) {
        return null;
    }

    public void delete(Long id, String jourPointage) {
        Optional<JourPointageEntity> jourPointageToDelete = jourPointageRepository.findByPointageIdAndJourPointage(id, LocalDate.parse(jourPointage, DATE_FORMATTER));
        if (jourPointageToDelete.isPresent()) {
            jourPointageRepository.delete(jourPointageToDelete.get());
        }
    }

    public JourPointageDto findByIdAndJourPointage(Long id, String jourPointage) {
        return jourPointageMapper
                .toDto(jourPointageRepository
                        .findByPointageIdAndJourPointage(id, LocalDate.parse(jourPointage, DATE_FORMATTER)).orElse(null));
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

    public boolean isExistByPointageIdAndJourPointage(Long id, String date) {
        return jourPointageRepository.isExistByPointageIdAndJourPointage(id, LocalDate.parse(date, DATE_FORMATTER));
    }

    public List<PointageStatsDto> getStatsByPointageId(Long pointageId){
        LocalDate startOfYear = LocalDate.now().withDayOfYear(1);
        LocalDate endOfYear = LocalDate.now().withDayOfYear(LocalDate.now().lengthOfYear());
        jourPointageRepository.findAllByPointageId(pointageId, startOfYear, endOfYear);
        return null;
    }

    private Stream<Optional<Specification<JourPointageEntity>>> buildFilterStream(String startDate, String endDate, Long idPointage) {
        Optional<Specification<JourPointageEntity>> idEmployeSpec = idPointage != null ? Optional.of(idPointage)
                .map(value -> SpecificationsUtils.equals("pointageEntity.id", value)) : Optional.empty();
        Optional<Specification<JourPointageEntity>> dateRangeSpec = !startDate.isEmpty() && !endDate.isEmpty() ? Optional.of(startDate)
                .map(value -> SpecificationsUtils.betweenValues(LocalDate.parse(startDate, DATE_FORMATTER), LocalDate.parse(endDate, DATE_FORMATTER))) : Optional.empty();
        Optional<Specification<JourPointageEntity>> orderASCBySpec = Optional.of(SpecificationsUtils.orderASCBy("jourPointage"));

        return Stream.of(idEmployeSpec, dateRangeSpec, orderASCBySpec);
    }

}
