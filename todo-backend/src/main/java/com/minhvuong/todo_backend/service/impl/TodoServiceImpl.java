package com.minhvuong.todo_backend.service.impl;

import com.minhvuong.todo_backend.dto.request.TodoCreateRequest;
import com.minhvuong.todo_backend.dto.request.TodoUpdateRequest;
import com.minhvuong.todo_backend.dto.response.TodoResponse;
import com.minhvuong.todo_backend.entity.Todo;
import com.minhvuong.todo_backend.enums.ErrorCode;
import com.minhvuong.todo_backend.enums.TaskStatus;
import com.minhvuong.todo_backend.exception.AppException;
import com.minhvuong.todo_backend.mapper.TodoMapper;
import com.minhvuong.todo_backend.repository.TodoRepository;
import com.minhvuong.todo_backend.service.TodoService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TodoServiceImpl implements TodoService {
    TodoRepository todoRepository;
    TodoMapper todoMapper;

    @Override
    public TodoResponse createTodo(TodoCreateRequest request) {
        if (todoRepository.existsByTitle(request.getTitle())) {
            throw new AppException(ErrorCode.RESOURCE_ALREADY_EXISTS, "Task title");
        }
        Todo todo = todoMapper.toTodo(request);
        todo.setStatus(TaskStatus.PENDING);
        Todo savedTodo = todoRepository.save(todo);
        return todoMapper.toTodoResponse(savedTodo);
    }

    @Override
    public TodoResponse updateTodo(Long id, TodoUpdateRequest request) {

        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Todo id " + id));

        if (!todo.getTitle().equalsIgnoreCase(request.getTitle())) {
            if (todoRepository.existsByTitle(request.getTitle())) {
                throw new AppException(ErrorCode.RESOURCE_ALREADY_EXISTS, "Task title");
            }
        }

        todoMapper.updateTodoFromRequest(request, todo);
        Todo updatedTodo = todoRepository.save(todo);
        return todoMapper.toTodoResponse(updatedTodo);
    }

    @Override
    public Page<TodoResponse> getAllTodos(String keyword, TaskStatus status, Pageable pageable) {
        return todoRepository.findAllWithFilters(keyword, status, pageable)
                .map(todoMapper::toTodoResponse);
    }

    @Override
    public void deleteTodo(Long id) {
        if (!todoRepository.existsById(id)) {
            throw new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Todo id " + id);
        }
        todoRepository.deleteById(id);
    }

    @Override
    public TodoResponse toggleStatus(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESOURCE_NOT_FOUND, "Todo id " + id));
        todo.setStatus(todo.getStatus() == TaskStatus.COMPLETED ? TaskStatus.PENDING : TaskStatus.COMPLETED);
        Todo updated = todoRepository.save(todo);
        return todoMapper.toTodoResponse(updated);
    }
}
