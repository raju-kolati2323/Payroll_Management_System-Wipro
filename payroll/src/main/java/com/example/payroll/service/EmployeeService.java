package com.example.payroll.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.payroll.dto.EmployeeDataDTO;
import com.example.payroll.model.Department;
import com.example.payroll.model.Employee;
import com.example.payroll.model.JobRole;
import com.example.payroll.model.User;
import com.example.payroll.repository.*;

@Service
public class EmployeeService {

	@Autowired
    private UserRepository userRepository;
	
	@Autowired
    private DepartmentRepository departmentRepository;
	
	@Autowired
    private EmployeeRepository employeeRepository;
	
	@Autowired
    private JobRoleRepository jobRoleRepository;
	
	// get all employees
	public List<Employee> getEmployees() {
	    List<Employee> employees = employeeRepository.findAll();
	    if (employees.isEmpty()) {
	        throw new RuntimeException("No employees found");
	    }
	    return employees;
	}
    
	// create new employee
    public Employee createEmployee(EmployeeDataDTO employeeData) {
        Department department = departmentRepository.findById(employeeData.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + employeeData.getDepartmentId()));

        String designationNormalized = employeeData.getDesignation().toLowerCase().trim();
        Optional<JobRole> jobRoleOpt = jobRoleRepository.findByJobroleAndDepartment(designationNormalized, department);
        if (jobRoleOpt.isEmpty()) {
            throw new RuntimeException("Job role '" + employeeData.getDesignation() + "' not found in department with id: " + employeeData.getDepartmentId());
        }

        User user = userRepository.findById(employeeData.getUserId()).orElseThrow(() -> new RuntimeException("User not found with id: " + employeeData.getUserId()));

        Employee employee = new Employee();
        employee.setUser(user);
        employee.setDepartment(department);
        employee.setFirst_name(employeeData.getFirst_name());
        employee.setLast_name(employeeData.getLast_name());
        employee.setDob(employeeData.getDob());
        employee.setPhone(employeeData.getPhone());
        employee.setAddress(employeeData.getAddress());
        employee.setDesignation(employeeData.getDesignation());
        employee.setSalary(employeeData.getSalary());

        return employeeRepository.save(employee);
    }


    // update employee by id
    public Employee updateEmployee(Long employeeId, EmployeeDataDTO employeeData) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));

        Department department = departmentRepository.findById(employeeData.getDepartmentId()).orElseThrow(() -> new RuntimeException("Department not found with id: " + employeeData.getDepartmentId()));

        String designationNormalized = employeeData.getDesignation().toLowerCase().trim();
        Optional<JobRole> jobRoleOpt = jobRoleRepository.findByJobroleAndDepartment(designationNormalized, department);
        if (jobRoleOpt.isEmpty()) {
            throw new RuntimeException("Job role '" + employeeData.getDesignation() + "' not found in department with id: " + employeeData.getDepartmentId());
        }
        User user = userRepository.findById(employeeData.getUserId()).orElseThrow(() -> new RuntimeException("User not found with id: " + employeeData.getUserId()));

        employee.setUser(user);
        employee.setDepartment(department);
        employee.setFirst_name(employeeData.getFirst_name());
        employee.setLast_name(employeeData.getLast_name());
        employee.setDob(employeeData.getDob());
        employee.setPhone(employeeData.getPhone());
        employee.setAddress(employeeData.getAddress());
        employee.setDesignation(employeeData.getDesignation());
        employee.setSalary(employeeData.getSalary());

        return employeeRepository.save(employee);
    }

}
