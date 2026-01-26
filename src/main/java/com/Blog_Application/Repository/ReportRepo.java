package com.Blog_Application.Repository;

import com.Blog_Application.Entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepo extends JpaRepository<Report, Integer> {

}