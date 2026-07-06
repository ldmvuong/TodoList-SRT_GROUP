package com.minhvuong.todo_backend.common;

import com.minhvuong.todo_backend.dto.response.PageResponse;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import java.time.LocalDateTime;
import java.time.ZoneId;

@RestControllerAdvice
public class ApiResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
        // Apply to all controller responses
        return true;
    }

    @Override
    public Object beforeBodyWrite(Object body,
                                  MethodParameter returnType,
                                  MediaType selectedContentType,
                                  Class<? extends HttpMessageConverter<?>> selectedConverterType,
                                  ServerHttpRequest request,
                                  ServerHttpResponse response) {

        // If already an ApiResponse, return as-is
        if (body instanceof ApiResponse) {
            return body;
        }

        // If controller returned ResponseEntity, unwrap and preserve status
        if (body instanceof ResponseEntity) {
            ResponseEntity<?> resp = (ResponseEntity<?>) body;
            Object inner = resp.getBody();
            // If body is already ApiResponse, just forward
            if (inner instanceof ApiResponse) {
                return resp;
            }

            ApiResponse<Object> api = buildSuccessResponse(inner, request.getURI().getPath());
            return ResponseEntity.status(resp.getStatusCode()).body(api);
        }

        // For normal body objects (including PageResponse), wrap into ApiResponse with 200 OK
        ApiResponse<Object> api = buildSuccessResponse(body, request.getURI().getPath());
        response.setStatusCode(HttpStatus.OK);
        return api;
    }

    private ApiResponse<Object> buildSuccessResponse(Object data, String path) {
        return ApiResponse.builder()
                .success(true)
                .status("SUCCESS")
                .code(HttpStatus.OK.value())
                .message(null)
                .data(data)
                .path(path)
                .timestamp(LocalDateTime.now(ZoneId.of(Constant.TIMEZONE_VIETNAM)))
                .build();
    }
}
