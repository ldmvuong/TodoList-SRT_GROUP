package com.minhvuong.todo_backend.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    VALIDATION_ERROR("Invalid input value.", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND("%s not found", HttpStatus.NOT_FOUND),
    RESOURCE_ALREADY_EXISTS("%s already exists", HttpStatus.CONFLICT),
    INVALID_REQUEST("Invalid request, %s", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION("Unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR),
    INTERNAL_SERVER_ERROR("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String message, HttpStatus httpStatus) {
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public int getHttpStatusCode() {
        return httpStatus.value();
    }
}