package com.example.payroll.security;

import com.example.payroll.model.Employee;
import com.example.payroll.service.CommonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("employeeSecurity")
public class EmployeeSecurity {

    @Autowired
    private CommonService commonService;

    public boolean isSelf(Long employeeId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String currentUsername = authentication.getName();

        Employee employee;
        try {
            employee = commonService.getEmployeeById(employeeId);
        } catch (RuntimeException e) {
            return false;
        }

        if (employee == null || employee.getUser() == null) {
            return false;
        }

        String employeeUsername = employee.getUser().getUsername();
        return currentUsername.equals(employeeUsername);
    }
}
