package com.management.creatifpro.stock.controllers;

import com.management.creatifpro.stock.models.dtos.EtatStockDto;
import com.management.creatifpro.stock.services.EtatStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.ResponseEntity.ok;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stock/etat")
public class EtatStockController {

    private final EtatStockService etatStockService;

    @PostMapping
    public ResponseEntity<List<EtatStockDto>> getEtatStock() {
        return ok(etatStockService.getEtatStock());
    }
}

