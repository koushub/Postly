package com.Blog_Application.BlogServices;

import com.Blog_Application.Payload.ReportDto;
import java.util.List;

public interface ReportService {
    ReportDto createReport(ReportDto reportDto, int reporterId);
    List<ReportDto> getAllReports();
    void deleteReport(int reportId);
}