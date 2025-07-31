package com.management.creatifpro.controllers;

import com.management.creatifpro.models.dtos.requests.CreatePointageRequestDto;
import com.management.creatifpro.models.dtos.requests.UpdatePointageRequestDto;
import com.management.creatifpro.models.dtos.requests.SearchPointageRequestDto;
import com.management.creatifpro.models.dtos.responses.PointageResponseDto;
import com.management.creatifpro.services.PointageService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.management.creatifpro.utils.Resource.POINTAGE.CREATE_POINTAGE_HORAIRE;
import static com.management.creatifpro.utils.Resource.POINTAGE.CREATE_POINTAGE_SALARIE;
import static com.management.creatifpro.utils.Resource.POINTAGE.DELETE_POINTAGE;
import static com.management.creatifpro.utils.Resource.POINTAGE.EXPORT_POINTAGE;
import static com.management.creatifpro.utils.Resource.POINTAGE.GET_POINTAGE_HORAIRE_BY_ID;
import static com.management.creatifpro.utils.Resource.POINTAGE.GET_POINTAGE_SALARIE_BY_ID;
import static com.management.creatifpro.utils.Resource.POINTAGE.POINTAGES;
import static com.management.creatifpro.utils.Resource.POINTAGE.UPDATE_POINTAGE_HORAIRE;
import static com.management.creatifpro.utils.Resource.POINTAGE.UPDATE_POINTAGE_SALARIE;
import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping(POINTAGES)
public class PointageController {

    private final PointageService pointageService;

    @PostMapping
    public ResponseEntity<Page<PointageResponseDto>> search(@RequestBody SearchPointageRequestDto request) {
        return ok(pointageService.search(request));
    }

    @PostMapping(CREATE_POINTAGE_HORAIRE)
    public ResponseEntity<List<PointageResponseDto>> createHoraire(@RequestBody @Valid CreatePointageRequestDto request) {
        return ok(pointageService.create(request));
    }

    @PostMapping(CREATE_POINTAGE_SALARIE)
    public ResponseEntity<List<PointageResponseDto>> createSalarie(@RequestBody @Valid CreatePointageRequestDto request) {
        return ok(pointageService.create(request));
    }

    @PutMapping(UPDATE_POINTAGE_HORAIRE)
    public ResponseEntity<PointageResponseDto> updateHoraire(@RequestBody UpdatePointageRequestDto request) {
        return ok(pointageService.update(request));
    }

    @PutMapping(UPDATE_POINTAGE_SALARIE)
    public ResponseEntity<PointageResponseDto> updateSalarie(@RequestBody UpdatePointageRequestDto request) {
        return ok(pointageService.update(request));
    }

    @GetMapping(GET_POINTAGE_HORAIRE_BY_ID)
    public ResponseEntity<PointageResponseDto> findHoraireById(@PathVariable Long id) {
        return ok(pointageService.findById(id));
    }

    @GetMapping(GET_POINTAGE_SALARIE_BY_ID)
    public ResponseEntity<PointageResponseDto> findSalarieById(@PathVariable Long id) {
        return ok(pointageService.findById(id));
    }

    @DeleteMapping(DELETE_POINTAGE)
    public void deleteById(@PathVariable Long id) {
        pointageService.delete(id);
    }

    @GetMapping(EXPORT_POINTAGE)
    public ResponseEntity<byte[]> export(@PathParam("startDate") String startDate,
                                         @PathParam("endDate") String endDate,
                                         @PathParam("contractType") String typeContrat,
                                         @PathParam("endDate") Long idPontage) {

        /*LocalDate start = LocalDate.parse(startDate, DATE_FORMATTER);
        LocalDate end = LocalDate.parse(endDate, DATE_FORMATTER);
        Page<PointageResponseDto> pointages;
        pointages = pointageService.search(new SearchPointageRequestDto(
                Optional.empty(),
                Optional.empty(),
                Optional.of(contractType),
                Optional.of(startDate),
                Optional.of(endDate),
                Optional.of(0),
                idPontage != null ? Optional.of(idPontage) : Optional.empty(),
                Optional.of(1000),
                Optional.empty()));

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Pointages");

        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Nom et Prénom");
        headerRow.createCell(1).setCellValue("Projet");

        pointageService.buildHeader(headerRow, start, end);

        int rowCount = 1;

        for (PointageResponseDto pointage : pointages) {

            Row dataRow = sheet.createRow(rowCount++);
            dataRow.createCell(0).setCellValue(pointage.employe().firstName() + " " + pointage.employe().lastName());
            dataRow.createCell(1).setCellValue(pointage.employe().project().firstName());

            List<JourPointageDto> jourPointages = jourPointageService.findAll(startDate, endDate, pointage.id());
            for (JourPointageDto jourPointage : jourPointages) {
                if (!LocalDate.parse(jourPointage.jourPointage(), DATE_FORMATTER).isBefore(start) &&
                        !LocalDate.parse(jourPointage.jourPointage(), DATE_FORMATTER).isAfter(end)) {
                    dataRow.createCell(dataRow.getPhysicalNumberOfCells()).setCellValue(jourPointage.pointage());
                }
            }
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try {
            workbook.write(baos);
            workbook.close();
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "Pointage_" + startDate + "_" + endDate + ".xlsx");

        // Return the Excel file as byte array
        return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);*/
        return null;

    }

}
