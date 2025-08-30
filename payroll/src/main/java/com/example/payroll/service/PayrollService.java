package com.example.payroll.service;

import com.example.payroll.model.*;
import com.example.payroll.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private SalaryStructureRepository salaryStructureRepository;

    @Autowired
    private PayrollRunRepository payrollRunRepository;

    
    //Creates a payroll run
    @Transactional
    public PayrollRun createPayrollRun(int year, int month) {
        LocalDate runDate = LocalDate.of(year, month, 1);

        PayrollRun payrollRun = payrollRunRepository.findByRunDate(runDate)
                .orElseGet(() -> {
                    PayrollRun newRun = new PayrollRun();
                    newRun.setRunDate(runDate);
                    newRun.setLocked(false);
                    return payrollRunRepository.save(newRun);
                });

        if (payrollRun.isLocked()) {
            throw new RuntimeException("Payroll run for " + runDate + " is already locked");
        }

        List<Employee> employees = employeeRepository.findAll();
        if (employees.isEmpty()) throw new RuntimeException("No employees found");

        for (Employee employee : employees) {
            Payroll payroll = new Payroll();
            payroll.setEmployee(employee);
            payroll.setPayrollRun(payrollRun);
            payroll.setPayDate(runDate);
            payroll.setLocked(false);

            Optional<SalaryStructure> salaryOpt = salaryStructureRepository.findByEmployee(employee);
            double basicSalary = salaryOpt.map(SalaryStructure::getEmployeeSalary).orElse(employee.getSalary());
            double taxPercent = salaryOpt.map(ss -> ss.getTaxPercentage() != null ? ss.getTaxPercentage() : 0.0).orElse(0.0);
            double bonus = salaryOpt.map(ss -> ss.getBonusAmount() != null ? ss.getBonusAmount() : 0.0).orElse(0.0);

            double leaveDeduction = 0.0;

            double taxDeduction = basicSalary * taxPercent / 100;
            double totalDeductions = leaveDeduction + taxDeduction;

            payroll.setBasicSalary(basicSalary);
            payroll.setDeductions(totalDeductions);
            payroll.setBonus(bonus);
            payroll.setNetSalary(basicSalary - totalDeductions + bonus);

            payrollRepository.save(payroll);
        }

        return payrollRun;
    }

    // process payroll run
    @Transactional
    public void processPayrollRun(Long payrollRunId) {
        PayrollRun run = payrollRunRepository.findById(payrollRunId)
                .orElseThrow(() -> new RuntimeException("Payroll run not found"));

        if (run.isLocked()) throw new RuntimeException("Payroll run is locked");

        List<Payroll> payrolls = payrollRepository.findByPayrollRun(run);
        if (payrolls.isEmpty()) throw new RuntimeException("No payrolls found for this run");

        for (Payroll payroll : payrolls) {
            processPayroll(payroll.getPayrollId());
        }
    }

    // Process an individual payroll to use above
    @Transactional
    public Payroll processPayroll(Long payrollId) {
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new RuntimeException("Payroll not found"));

        if (payroll.isLocked()) throw new RuntimeException("Payroll is locked");

        Employee employee = payroll.getEmployee();
        Optional<SalaryStructure> salaryOpt = salaryStructureRepository.findByEmployee(employee);

        double basicSalary = salaryOpt.map(SalaryStructure::getEmployeeSalary).orElse(employee.getSalary());
        double taxPercent = salaryOpt.map(ss -> ss.getTaxPercentage() != null ? ss.getTaxPercentage() : 0.0).orElse(0.0);
        double bonus = salaryOpt.map(ss -> ss.getBonusAmount() != null ? ss.getBonusAmount() : 0.0).orElse(0.0);

        double leaveDeduction = 0.0;
        double taxDeduction = basicSalary * taxPercent / 100;
        double totalDeductions = leaveDeduction + taxDeduction;

        payroll.setBasicSalary(basicSalary);
        payroll.setDeductions(totalDeductions);
        payroll.setBonus(bonus);
        payroll.setNetSalary(basicSalary - totalDeductions + bonus);

        return payrollRepository.save(payroll);
    }

    // Lock a payroll run
    @Transactional
    public void lockPayrollRun(Long payrollRunId) {
        PayrollRun run = payrollRunRepository.findById(payrollRunId)
                .orElseThrow(() -> new RuntimeException("Payroll run not found"));

        if (run.isLocked()) throw new RuntimeException("Payroll run already locked");

        run.setLocked(true);
        payrollRunRepository.save(run);

        List<Payroll> payrolls = payrollRepository.findByPayrollRun(run);
        payrolls.forEach(p -> {
            p.setLocked(true);
            payrollRepository.save(p);
        });
    }

    // Get payroll run
    public List<Payroll> getPayrollRunItems(Long payrollRunId) {
        PayrollRun run = payrollRunRepository.findById(payrollRunId)
                .orElseThrow(() -> new RuntimeException("Payroll run not found"));
        return payrollRepository.findByPayrollRun(run);
    }
    
    
 // get payrolls for a given month/year for an employe
    @Transactional(readOnly = true)
    public List<Payroll> getEmployeePayrolls(Long employeeId, int year, int month) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        return payrollRepository.findByEmployeeAndPayDateBetween(employee, startDate, endDate);
    }

}


