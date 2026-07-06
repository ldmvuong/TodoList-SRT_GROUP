package com.minhvuong.todo_backend.dto.request;

import com.minhvuong.todo_backend.common.MessageConstant;
import com.minhvuong.todo_backend.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TodoUpdateRequest {
    @NotBlank(message = MessageConstant.TITLE_NOT_BLANK)
    @Size(max = 100, message = MessageConstant.TITLE_SIZE)
    String title;

    @Size(max = 500, message = MessageConstant.DESCRIPTION_SIZE)
    String description;

    @NotNull(message = MessageConstant.STATUS_NOT_NULL)
    TaskStatus status;
}
