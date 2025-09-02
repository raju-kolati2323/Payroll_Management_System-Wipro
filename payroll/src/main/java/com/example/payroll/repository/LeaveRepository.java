package com.example.payroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.payroll.model.*;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByEmployee(Employee employee);
    List<Leave> findByStatus(LeaveStatus status);
}
