package com.postly.BlogServices;

import com.postly.Payload.ReportDto;
import java.util.List;

public interface ReportService {
    ReportDto createReport(ReportDto reportDto, int reporterId);
    List<ReportDto> getAllReports();
    void deleteReport(int reportId);
}