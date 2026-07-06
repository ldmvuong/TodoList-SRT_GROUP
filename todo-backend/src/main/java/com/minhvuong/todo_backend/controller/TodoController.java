package com.minhvuong.todo_backend.controller;

import com.minhvuong.todo_backend.dto.request.TodoCreateRequest;
import com.minhvuong.todo_backend.dto.request.TodoUpdateRequest;
import com.minhvuong.todo_backend.dto.response.PageResponse;
import com.minhvuong.todo_backend.dto.response.TodoResponse;
import com.minhvuong.todo_backend.enums.TaskStatus;
import com.minhvuong.todo_backend.mapper.PageMapper;
import com.minhvuong.todo_backend.service.TodoService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class TodoController {
    TodoService todoService;

    @GetMapping
    public PageResponse<TodoResponse> getAllTodos(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "status", required = false) TaskStatus status,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "pageSize", defaultValue = "10") int pageSize,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortDirection", defaultValue = "DESC") Sort.Direction sortDirection) {

        Pageable pageable = PageRequest.of(page, pageSize, Sort.by(sortDirection, sortBy));
        Page<TodoResponse> todos = todoService.getAllTodos(keyword, status, pageable);
        
        return PageMapper.toPageResponse(todos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoUpdateRequest request) {
        TodoResponse response = todoService.updateTodo(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(@Valid @RequestBody TodoCreateRequest request) {
        TodoResponse response = todoService.createTodo(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TodoResponse> toggleStatus(@PathVariable Long id) {
        TodoResponse response = todoService.toggleStatus(id);
        return ResponseEntity.ok(response);
    }
}
