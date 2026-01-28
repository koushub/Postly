package com.postly.Services.Imple;

import com.postly.BlogServices.ReportService;
import com.postly.Entities.*;
import com.postly.Exception.ResourceNotFoundException;
import com.postly.Payload.ReportDto;
import com.postly.Repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final ReportRepo reportRepo;
    private final UserRepo userRepo;
    private final PostRepo postRepo;
    private final CommentsRepo commentsRepo;

    @Override
    public ReportDto createReport(ReportDto reportDto, int reporterId) {
        User reporter = userRepo.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", reporterId));

        Report report = new Report();
        report.setReason(reportDto.getReason());
        report.setReporter(reporter);

        if (reportDto.getPostId() != null) {
            Post post = postRepo.findById(reportDto.getPostId())
                    .orElseThrow(() -> new ResourceNotFoundException("Post", "id", reportDto.getPostId()));
            report.setPost(post);
        }
        else if (reportDto.getCommentId() != null) {
            Comment comment = commentsRepo.findById(reportDto.getCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Comment", "id", reportDto.getCommentId()));
            report.setComment(comment);
        }
        else if (reportDto.getReportedUserId() != null) {
            User user = userRepo.findById(reportDto.getReportedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", reportDto.getReportedUserId()));
            report.setReportedUser(user);
        }

        Report saved = reportRepo.save(report);
        return mapToDto(saved);
    }

    @Override
    public List<ReportDto> getAllReports() {
        return reportRepo.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteReport(int reportId) {
        Report report = reportRepo.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", reportId));
        reportRepo.delete(report);
    }

    private ReportDto mapToDto(Report r) {
        ReportDto dto = new ReportDto();
        dto.setId(r.getId());
        dto.setReason(r.getReason());
        dto.setReporterName(r.getReporter().getName());

        if (r.getPost() != null) {
            dto.setPostId(r.getPost().getPostId());
            dto.setContentPreview("Post: " + r.getPost().getTitle());
        } else if (r.getComment() != null) {
            dto.setCommentId(r.getComment().getId());
            dto.setContentPreview("Comment: " + r.getComment().getContent());
        } else if (r.getReportedUser() != null) {
            dto.setReportedUserId(r.getReportedUser().getId());
            dto.setContentPreview("User: " + r.getReportedUser().getName());
        }
        return dto;
    }
}