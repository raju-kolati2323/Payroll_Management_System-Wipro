package com.example.payroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payroll.model.Department;
import com.example.payroll.model.Employee;
import com.example.payroll.model.User;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Employee findByUser(User user);
    
    //department
    boolean existsByDepartment(Department department);
    
    // job
    List<Employee> findByDesignationAndDepartment(String designation, Department department);
}
