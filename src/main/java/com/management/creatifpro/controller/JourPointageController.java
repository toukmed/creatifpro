package com.management.creatifpro.controller;

import com.management.creatifpro.dto.JourPointageDto;
import com.management.creatifpro.dto.SearchDto;
import com.management.creatifpro.service.JourPointageService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/jourPointages")
public class JourPointageController {

    private final JourPointageService jourPointageService;

    @PostMapping
    public List<JourPointageDto> allJourPointages(@RequestBody SearchDto searchDto){
        return jourPointageService.listAll(searchDto);
    }

    @PostMapping("/create")
    public ResponseEntity<JourPointageDto> create(@RequestBody @Valid JourPointageDto dto){
        return ResponseEntity.ok(jourPointageService.create(dto));
    }

    @PutMapping("/update")
    public ResponseEntity<JourPointageDto> update(@RequestBody JourPointageDto dto){
        return ResponseEntity.ok(jourPointageService.update(dto));
    }

    @GetMapping("/{id}")
    public JourPointageDto findByPointageId(@PathVariable Long id, @PathParam("jourPointage") String jourPointage){
        return jourPointageService.findByIdAndJourPointage(id, jourPointage);
    }

    @GetMapping("/isExistBy")
    public ResponseEntity<Boolean> isExistBy(
            @PathParam("idPointage") Long idPointage,
            @PathParam("jourPointage") String jourPointage){
        return ResponseEntity.ok(jourPointageService.isExistByPointageIdAndJourPointage(idPointage, jourPointage));
    }

}
