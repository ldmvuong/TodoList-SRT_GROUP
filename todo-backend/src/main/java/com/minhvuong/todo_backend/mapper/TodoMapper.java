package com.minhvuong.todo_backend.mapper;

import com.minhvuong.todo_backend.dto.request.TodoCreateRequest;
import com.minhvuong.todo_backend.dto.request.TodoUpdateRequest;
import com.minhvuong.todo_backend.dto.response.TodoResponse;
import com.minhvuong.todo_backend.entity.Todo;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TodoMapper {

    TodoResponse toTodoResponse(Todo todo);
    Todo toTodo(TodoCreateRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateTodoFromRequest(TodoUpdateRequest request, @MappingTarget Todo todo);

}
