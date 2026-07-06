package com.minhvuong.todo_backend.exception;

import com.minhvuong.todo_backend.common.ApiResponse;
import com.minhvuong.todo_backend.common.Constant;
import com.minhvuong.todo_backend.enums.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Bắt lỗi hệ thống chưa được định nghĩa trước (Lỗi 500)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception exception, HttpServletRequest request) {
        return buildResponseEntity(ErrorCode.UNCATEGORIZED_EXCEPTION, request.getRequestURI(), ErrorCode.UNCATEGORIZED_EXCEPTION.getMessage());
    }

    // 2. Bắt các lỗi Business Logic do bạn chủ động ném ra từ tầng Service
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(AppException exception, HttpServletRequest request) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .status(exception.getErrorCode().name())
                .code(exception.getErrorCode().getHttpStatusCode())
                .message(exception.getMessage())
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now(ZoneId.of(Constant.TIMEZONE_VIETNAM)))
                .build();
        return ResponseEntity.status(exception.getHttpStatus()).body(response);
    }

    // 3. Bắt lỗi Validation đầu vào khi Client gửi dữ liệu sai định dạng cấu hình ở DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .status(ErrorCode.VALIDATION_ERROR.name())
                .code(ErrorCode.VALIDATION_ERROR.getHttpStatusCode())
                .message(ErrorCode.VALIDATION_ERROR.getMessage())
                .errors(errors) // Danh sách các field bị validate fail
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now(ZoneId.of(Constant.TIMEZONE_VIETNAM)))
                .build();

        return ResponseEntity.status(ErrorCode.VALIDATION_ERROR.getHttpStatus()).body(response);
    }

    private ResponseEntity<ApiResponse<Void>> buildResponseEntity(ErrorCode errorCode, String path, String message) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(false)
                .status(errorCode.name())
                .code(errorCode.getHttpStatusCode())
                .message(message)
                .path(path)
                .timestamp(LocalDateTime.now(ZoneId.of(Constant.TIMEZONE_VIETNAM)))
                .build();
        return ResponseEntity.status(errorCode.getHttpStatus()).body(response);
    }
}