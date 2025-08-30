package com.example.payroll.repository;

import com.example.payroll.model.Employee;
import com.example.payroll.model.Payroll;
import com.example.payroll.model.PayrollRun;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByEmployee(Employee employee);
    List<Payroll> findByEmployeeAndPayDateBetween(Employee employee, LocalDate startDate, LocalDate endDate);
    List<Payroll> findByPayrollRun(PayrollRun payrollRun);
    
    List<Payroll> findByPayDateBetween(LocalDate startDate, LocalDate endDate);

}