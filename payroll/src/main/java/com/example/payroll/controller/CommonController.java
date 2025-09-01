package com.example.payroll.controller;

import com.example.payroll.model.Employee;
import com.example.payroll.model.User;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.UserRepository;
import com.example.payroll.service.CommonService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@SecurityRequirement(name = "BearerAuth")
public class CommonController {

    @Autowired
    private CommonService commonService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    

    //get logged-in user details
    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser() {
        User currentUser = commonService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(currentUser);
    }
    
    @GetMapping("/employee/{userId}")
    public ResponseEntity<?> getEmployeeByUserId(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            Employee employee = employeeRepository.findByUser(user);
            if (employee == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Employee not found for this user"));
            }
            return ResponseEntity. ok(employee);

        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
        }
    }
    
    //get logged-in employee details // get employee by id (for admin)
    @PreAuthorize("hasRole('ADMIN') or @employeeSecurity.isSelf(#id)")
    @GetMapping("/employees/{id}")
    public ResponseEntity<?> getEmployee(@PathVariable Long id) {
        try {
            Employee employee = commonService.getEmployeeById(id);
            return ResponseEntity.ok(employee);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("message", e.getMessage()));
        }
    }
}
