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
    private String reporterName; // Just show name for simplicity

    // IDs of the targets (to help frontend know what to show)
    private Integer postId;
    private Integer commentId;
    private Integer reportedUserId;

    // Optional: Include Titles/Content previews if you want the dashboard to be fancy
    private String contentPreview;
}