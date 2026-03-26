package com.management.creatifpro.pointage.controllers;

import com.management.creatifpro.pointage.models.dtos.CreatePointageRequestDto;
import com.management.creatifpro.pointage.models.dtos.PointageResponseDto;
import com.management.creatifpro.pointage.models.dtos.SearchPointageRequestDto;
import com.management.creatifpro.pointage.models.dtos.UpdatePointageRequestDto;
import com.management.creatifpro.pointage.services.PointageService;
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

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pointages")
public class PointageController {

    private final PointageService pointageService;

    @PostMapping
    public ResponseEntity<Page<PointageResponseDto>> search(@RequestBody SearchPointageRequestDto request) {
        return ok(pointageService.search(request));
    }

    @PostMapping("/employee/{id}")
    public ResponseEntity<List<PointageResponseDto>> listById(@PathVariable("id") Long id,@RequestBody SearchPointageRequestDto request) {
        return ok(pointageService.listByEmployeeId(id, request));
    }

    @PostMapping("/{id}/create")
    public ResponseEntity<List<PointageResponseDto>> create(@RequestBody @Valid CreatePointageRequestDto request) {
        return ok(pointageService.create(request));
    }

    @PostMapping("/create")
    public ResponseEntity<List<PointageResponseDto>> createBulk(@RequestBody @Valid CreatePointageRequestDto request) {
        return ok(pointageService.create(request));
    }

    @PutMapping("/update")
    public ResponseEntity<PointageResponseDto> update(@RequestBody UpdatePointageRequestDto request) {
        return ok(pointageService.update(request));
    }

    @GetMapping("{id}")
    public ResponseEntity<PointageResponseDto> findById(@PathVariable Long id) {
        return ok(pointageService.findById(id));
    }

    @DeleteMapping("{id}")
    public void deleteById(@PathVariable Long id) {
        pointageService.delete(id);
    }

    @GetMapping("/export/{startDate}/{endDate}/{contractType}/{idPontage}")
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
