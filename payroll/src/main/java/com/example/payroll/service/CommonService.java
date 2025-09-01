package com.example.payroll.service;

import com.example.payroll.model.Employee;
import com.example.payroll.model.User;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CommonService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;
    
    //get logged-in user details
    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username);
    }
    
    //get employee by id
    public Employee getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        if (employee.getUser() != null) {
            employee.getUser().setPassword(null);
        }
        return employee;
    }

}
