package com.minhvuong.todo_backend.service;

import com.minhvuong.todo_backend.dto.request.TodoCreateRequest;
import com.minhvuong.todo_backend.dto.request.TodoUpdateRequest;
import com.minhvuong.todo_backend.dto.response.TodoResponse;
import com.minhvuong.todo_backend.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TodoService {
    TodoResponse createTodo(TodoCreateRequest request);
    TodoResponse updateTodo(Long id, TodoUpdateRequest request);
    Page<TodoResponse> getAllTodos(String keyword, TaskStatus status, Pageable pageable);
    void deleteTodo(Long id);
    TodoResponse toggleStatus(Long id);
}
