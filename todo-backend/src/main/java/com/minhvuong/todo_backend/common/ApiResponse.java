package com.minhvuong.todo_backend.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private boolean success;
    private String status;       // "SUCCESS", "VALIDATION_ERROR")
    private int code;            // Internal Code, ví dụ: 200, 4001, 4042)
    private String path;         // Request URI Error
    private LocalDateTime timestamp;
    private T data;              // Data
    private Object errors;       // Validation errors
    private String message;      // Common message for the response
}