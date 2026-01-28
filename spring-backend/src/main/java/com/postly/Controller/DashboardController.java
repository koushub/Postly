package com.postly.Controller;

import com.postly.Payload.DashboardDto;
import com.postly.Repository.PostRepo;
import com.postly.Repository.ReportRepo; // Assuming you added this from previous step
import com.postly.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/home/api")
@RequiredArgsConstructor
public class DashboardController {

    private final UserRepo userRepo;
    private final PostRepo postRepo;
    private final ReportRepo reportRepo; // Add ReportRepo injection

    @PreAuthorize("hasRole('ADMIN')") // Only Admin should see stats
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardDto> getDashboardStats() {

        // 1. Count Active Users
        long userCount = userRepo.countByIsDeletedFalse();

        // 2. Count All Posts
        long postCount = postRepo.count();

        // 3. Count Reports (Assuming you implemented the Report entity)
        long reportCount = reportRepo.count();

        DashboardDto stats = new DashboardDto(userCount, postCount, reportCount);

        return ResponseEntity.ok(stats);
    }
}