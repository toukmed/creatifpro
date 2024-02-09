package com.management.creatifpro.exception;

import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException ex) {
        List<ValidationErrorDto> validationErrors = new ArrayList<>();
        for(ObjectError error: ex.getBindingResult().getAllErrors()){
            validationErrors.add(new ValidationErrorDto(error.getObjectName(), error.getDefaultMessage()));
        }
        return ResponseEntity.badRequest().body(validationErrors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handleMessageNotReadableException(HttpMessageNotReadableException ex){
        return ResponseEntity.badRequest().body(new ValidationErrorDto(null, ex.getMessage()));
    }

    @ExceptionHandler(PropertyReferenceException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Object> handlePropertyReferenceException(PropertyReferenceException ex){
        return ResponseEntity.badRequest().body(new ValidationErrorDto(ex.getPropertyName(), ex.getMessage()));
    }
}
