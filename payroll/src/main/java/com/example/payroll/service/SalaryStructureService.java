package com.example.payroll.service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.payroll.dto.SalaryStructureDTO;
import com.example.payroll.model.Employee;
import com.example.payroll.model.SalaryStructure;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.SalaryStructureRepository;

@Service
public class SalaryStructureService {

    @Autowired
    private SalaryStructureRepository salaryStructureRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // get salary structure of specific employee
    public SalaryStructure getSalaryStructureByEmployeeId(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + employeeId));

        return salaryStructureRepository.findByEmployee(employee)
                .orElseThrow(() -> new RuntimeException("Salary Structure not found for employee with ID: " + employeeId));
    }

    // Create or update salary structure
    public SalaryStructure createOrUpdateSalaryStructure(Employee employee, SalaryStructureDTO salaryStructureDTO) {
        Optional<SalaryStructure> existingSalaryStructureOptional = salaryStructureRepository.findByEmployee(employee);

        existingSalaryStructureOptional.ifPresent(salaryStructureRepository::delete);

        SalaryStructure salaryStructure = new SalaryStructure();
        salaryStructure.setEmployee(employee);
        salaryStructure.setEmployeeSalary(salaryStructureDTO.getEmployeeSalary());
        salaryStructure.setTotalPaidLeavesPerYear(salaryStructureDTO.getTotalPaidLeavesPerYear());
        salaryStructure.setTaxPercentage(salaryStructureDTO.getTaxPercentage());
        salaryStructure.setSalaryDeductionPerDay(salaryStructureDTO.getSalaryDeductionPerDay());
        salaryStructure.setBonusAmount(salaryStructureDTO.getBonusAmount());

        return salaryStructureRepository.save(salaryStructure);
    }
}
