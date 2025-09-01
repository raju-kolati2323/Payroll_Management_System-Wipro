package com.example.payroll.service;

import com.example.payroll.model.Department;
import com.example.payroll.model.Payroll;
import com.example.payroll.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PayrollReportService {

    @Autowired
    private PayrollRepository payrollRepository;

    // generate payroll summary for a period
    public Map<String, Double> getPayrollSummary(LocalDate startDate, LocalDate endDate) {
        List<Payroll> payrolls = payrollRepository.findByPayDateBetween(startDate, endDate);

        double totalNetSalary = payrolls.stream().mapToDouble(Payroll::getNetSalary).sum();
        double totalBonus = payrolls.stream().mapToDouble(p -> p.getBonus() != null ? p.getBonus() : 0).sum();
        double totalDeductions = payrolls.stream().mapToDouble(p -> p.getDeductions() != null ? p.getDeductions() : 0).sum();

        Map<String, Double> summary = new HashMap<>();
        summary.put("totalNetSalary", totalNetSalary);
        summary.put("totalBonus", totalBonus);
        summary.put("totalDeductions", totalDeductions);

        return summary;
    }

    // get department-cost report
    public List<Map<String, Object>> getDepartmentCostReport(LocalDate startDate, LocalDate endDate) {
        List<Payroll> payrolls = payrollRepository.findByPayDateBetween(startDate, endDate);

        Map<Department, List<Payroll>> grouped = payrolls.stream().collect(Collectors.groupingBy(p -> p.getEmployee().getDepartment()));

        List<Map<String, Object>> report = new ArrayList<>();

        for (Map.Entry<Department, List<Payroll>> entry : grouped.entrySet()) {
            Department dept = entry.getKey();
            List<Payroll> deptPayrolls = entry.getValue();

            double totalNetSalary = deptPayrolls.stream().mapToDouble(Payroll::getNetSalary).sum();
            double totalBonus = deptPayrolls.stream().mapToDouble(p -> p.getBonus() != null ? p.getBonus() : 0).sum();
            double totalDeductions = deptPayrolls.stream().mapToDouble(p -> p.getDeductions() != null ? p.getDeductions() : 0).sum();

            Map<String, Object> deptReport = new HashMap<>();
            deptReport.put("departmentId", dept.getDepartment_id());
            deptReport.put("departmentName", dept.getName());
            deptReport.put("totalNetSalary", totalNetSalary);
            deptReport.put("totalBonus", totalBonus);
            deptReport.put("totalDeductions", totalDeductions);

            report.add(deptReport);
        }

        return report;
    }
}
