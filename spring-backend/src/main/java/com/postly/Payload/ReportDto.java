package com.postly.Payload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ReportDto {
    private int id;
    private String reason;
    private String reporterName;

    private Integer postId;
    private Integer commentId;
    private Integer reportedUserId;

    private String contentPreview;
}