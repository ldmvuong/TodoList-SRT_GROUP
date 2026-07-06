package com.minhvuong.todo_backend.common;

public final class MessageConstant {
    private MessageConstant() {

        throw new UnsupportedOperationException("This is a constant class and cannot be instantiated");
    }

    // Validation Messages
    public static final String TITLE_NOT_BLANK = "Title not blank";
    public static final String TITLE_SIZE = "Title length must not exceed 100 characters";
    public static final String DESCRIPTION_SIZE = "Description length must not exceed 500 characters";
    public static final String STATUS_NOT_NULL = "Status must not be null";
    // Exception Messages
}
