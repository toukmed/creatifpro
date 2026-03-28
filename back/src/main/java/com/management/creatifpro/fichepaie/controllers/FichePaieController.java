package com.management.creatifpro.fichepaie.controllers;

import com.management.creatifpro.fichepaie.services.FichePaieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/fiche-paie")
public class FichePaieController {

    private final FichePaieService fichePaieService;

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @GetMapping("employee/{employeeId}")
    public ResponseEntity<byte[]> downloadFichePaie(
            @PathVariable Long employeeId,
            @RequestParam int year,
            @RequestParam int month) {

        byte[] pdfBytes = fichePaieService.generateFichePaie(employeeId, year, month);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        String filename = String.format("Fiche_Paie_%d_%02d_%d.pdf", employeeId, month, year);
        headers.setContentDispositionFormData("attachment", filename);
        headers.setCacheControl("no-cache, no-store, must-revalidate");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}

