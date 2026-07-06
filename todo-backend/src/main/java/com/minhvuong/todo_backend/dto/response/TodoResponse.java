package com.minhvuong.todo_backend.dto.response;

import com.minhvuong.todo_backend.enums.TaskStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TodoResponse {
    Long id;
    String title;
    String description;
    TaskStatus status;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
