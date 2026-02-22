package com.campus.emergency.dto;

import java.time.LocalDateTime;
import com.campus.emergency.model.Comment;
import lombok.Data;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private String authorName;
    private boolean anonymous;
    private LocalDateTime createdAt;

    public static CommentResponse fromEntity(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setAuthorName(comment.isAnonymous() ? "Anonymous" : comment.getAuthorName());
        dto.setAnonymous(comment.isAnonymous());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}
