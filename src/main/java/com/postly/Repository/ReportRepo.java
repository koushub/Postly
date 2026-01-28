package com.postly.Repository;

import com.postly.Entities.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepo extends JpaRepository<Report, Integer> {

}