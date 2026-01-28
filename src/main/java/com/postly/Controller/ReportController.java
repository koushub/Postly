package com.postly.Controller;

import com.postly.BlogServices.ReportService;
import com.postly.Payload.ApiResponse;
import com.postly.Payload.ReportDto;
import com.postly.Security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home/api")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // User: Submit a report
    @PostMapping("/report")
    public ResponseEntity<ReportDto> createReport(@RequestBody ReportDto reportDto, Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        int userId = Integer.parseInt(principal.getUserId());

        ReportDto created = reportService.createReport(reportDto, userId);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // Admin: View all reports
    @PreAuthorize("hasRole('ADMIN')") // Ensure only Admin can see this
    @GetMapping("/reports")
    public ResponseEntity<List<ReportDto>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // Admin: Dismiss (delete) a report (e.g., if it was a false alarm)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/report/{id}")
    public ResponseEntity<ApiResponse> dismissReport(@PathVariable int id) {
        reportService.deleteReport(id);
        return new ResponseEntity<>(new ApiResponse("Report dismissed", true), HttpStatus.OK);
    }
}