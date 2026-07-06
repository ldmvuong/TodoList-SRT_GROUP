package com.minhvuong.todo_backend.repository;

import com.minhvuong.todo_backend.entity.Todo;
import com.minhvuong.todo_backend.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    boolean existsByTitle(String title);

    @Query("SELECT t FROM Todo t WHERE " +
            "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR t.status = :status)")
    Page<Todo> findAllWithFilters(
            @Param("keyword") String keyword,
            @Param("status") TaskStatus status,
            Pageable pageable
    );
}
