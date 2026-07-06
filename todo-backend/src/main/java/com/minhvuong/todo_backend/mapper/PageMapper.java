package com.minhvuong.todo_backend.mapper;

import com.minhvuong.todo_backend.dto.response.PageResponse;
import org.springframework.data.domain.Page;

public class PageMapper {
    
    public static <T> PageResponse<T> toPageResponse(Page<T> page) {
        return PageResponse.<T>builder()
                .meta(PageResponse.Meta.builder()
                        .page(page.getNumber())
                        .pageSize(page.getSize())
                        .pages(page.getTotalPages())
                        .total(page.getTotalElements())
                        .build())
                .result((T) page.getContent())
                .build();
    }
}
