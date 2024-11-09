package com.management.creatifpro.controller;

import com.management.creatifpro.dto.JourPointageDto;
import com.management.creatifpro.dto.PointageDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.service.JourPointageService;
import com.management.creatifpro.service.PointageService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static com.management.creatifpro.util.CreatifUtils.DATE_FORMATTER;

@RestController
@RequiredArgsConstructor
@RequestMapping("/pointages")
public class PointageController {

    private final PointageService pointageService;
    private final JourPointageService jourPointageService;

    @PostMapping
    public Page<PointageDto> allPointages(@RequestBody SearchDto searchDto) {
        return pointageService.findAll(searchDto);
    }

    @PostMapping("/create")
    public void create(@RequestBody @Valid PointageDto pointageDto) {
        pointageService.create(pointageDto);
    }

    @PutMapping("/update")
    public ResponseEntity<PointageDto> update(@RequestBody PointageDto pointageDto) {
        return ResponseEntity.ok(pointageService.update(pointageDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PointageDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(pointageService.findById(id));
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportToCSV(@PathParam("startDate") String startDate,
                                              @PathParam("endDate") String endDate,
                                              @PathParam("typeContrat") String typeContrat,
                                              @PathParam("endDate") Long idPontage) {

        LocalDate start = LocalDate.parse(startDate, DATE_FORMATTER);
        LocalDate end = LocalDate.parse(endDate, DATE_FORMATTER);
        Page<PointageDto> pointages;
        pointages = pointageService.findAll(new SearchDto(
                Optional.empty(),
                Optional.empty(),
                Optional.of(typeContrat),
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

        for (PointageDto pointage : pointages) {

            Row dataRow = sheet.createRow(rowCount++);
            dataRow.createCell(0).setCellValue(pointage.employe().nom() + " " + pointage.employe().prenom());
            dataRow.createCell(1).setCellValue(pointage.employe().projet().nom());

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
        return new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);

    }

}
