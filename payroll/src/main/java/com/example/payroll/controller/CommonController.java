package com.example.payroll.controller;

import com.example.payroll.model.Employee;
import com.example.payroll.model.User;
import com.example.payroll.service.CommonService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@SecurityRequirement(name = "BearerAuth")
public class CommonController {

    @Autowired
    private CommonService commonService;

    //get logged-in user details
    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser() {
        User currentUser = commonService.getCurrentUser();
        if (currentUser == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(currentUser);
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
