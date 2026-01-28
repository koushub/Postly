package com.postly.Controller;

import com.postly.Payload.DashboardDto;
import com.postly.Repository.PostRepo;
import com.postly.Repository.ReportRepo;
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
    private final ReportRepo reportRepo;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardDto> getDashboardStats() {

        long userCount = userRepo.countByIsDeletedFalse();

        long postCount = postRepo.count();

        long reportCount = reportRepo.count();

        DashboardDto stats = new DashboardDto(userCount, postCount, reportCount);

        return ResponseEntity.ok(stats);
    }
}