package com.example.payroll.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.example.payroll.dto.LeaveRequestDTO;
import com.example.payroll.dto.LeaveResponseDTO;
import com.example.payroll.model.*;
import com.example.payroll.repository.*;
import com.example.payroll.service.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/v1")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeeController {
	
	 @Autowired
	    private LeaveService leaveService;
	 
	 @Autowired
	    private PayrollService payrollService;
	 
	 @Autowired
	 private UserRepository userRepository;
	 
	 @Autowired
	 private EmployeeRepository employeeRepository;

	 //request a leave
	    @PostMapping("/leaves")
	    public ResponseEntity<?> requestLeave(Authentication authentication, @RequestBody LeaveRequestDTO leaveRequestDTO) {
	        try {
	            String username = authentication.getName();

	            User user = userRepository.findByUsername(username);
	            if (user == null) {
	                throw new RuntimeException("User not found");
	            }

	            Employee employee = employeeRepository.findByUser(user);
	            if (employee == null) {
	                throw new RuntimeException("Employee not found");
	            }

	            Leave leave = leaveService.requestLeave(employee.getEmployee_id(), leaveRequestDTO);
	            LeaveResponseDTO responseDTO = mapToResponseDTO(leave);
	            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);

	        } catch (RuntimeException e) {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
	        }
	    }

	 // get all requested leaves
	    @GetMapping("/leaves")
	    public ResponseEntity<?> getLeavesByEmployee(Authentication authentication) {
	        try {
	            String username = authentication.getName();

	            User user = userRepository.findByUsername(username);
	            if (user == null) {
	                throw new RuntimeException("User not found");
	            }

	            Employee employee = employeeRepository.findByUser(user);
	            if (employee == null) {
	                throw new RuntimeException("Employee not found");
	            }

	            List<Leave> leaves = leaveService.getLeavesByEmployee(employee.getEmployee_id());
	            List<LeaveResponseDTO> responseDTOs = leaves.stream()
	                    .map(this::mapToResponseDTO)
	                    .collect(Collectors.toList());
	            return ResponseEntity.ok(responseDTOs);

	        } catch (RuntimeException e) {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
	        }
	    }
	    
	    // get payroll details
	    @GetMapping("/payroll/my/{year}/{month}")
	    public ResponseEntity<?> getEmployeePayroll(Authentication authentication, @PathVariable int year,@PathVariable int month) {
	        String username = authentication.getName();
	        User user = userRepository.findByUsername(username);
	        if (user == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
	        }

	        Employee employee = employeeRepository.findByUser(user);
	        if (employee == null) {
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Employee not found"));
	        }

	        List<Payroll> payrolls = payrollService.getEmployeePayrolls(employee.getEmployee_id(), year, month);
	        return ResponseEntity.ok(payrolls);
	    }

	    private LeaveResponseDTO mapToResponseDTO(Leave leave) {
	        LeaveResponseDTO dto = new LeaveResponseDTO();
	        dto.setLeaveId(leave.getLeaveId());
	        dto.setEmployeeId(leave.getEmployee().getEmployee_id());
	        dto.setFirstName(leave.getEmployee().getFirst_name());
	        dto.setLastName(leave.getEmployee().getLast_name());
	        dto.setStartDate(leave.getStartDate());
	        dto.setEndDate(leave.getEndDate());
	        dto.setLeaveType(leave.getLeaveType());
	        dto.setStatus(leave.getStatus());
	        return dto;
	    }

}
