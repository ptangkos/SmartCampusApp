package com.campus.emergency.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;
    private boolean anonymous;
    private String authorName;
}
