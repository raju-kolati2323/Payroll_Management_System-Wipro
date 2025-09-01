package com.example.payroll.service;

import com.example.payroll.dto.LeaveRequestDTO;
import com.example.payroll.model.*;
import com.example.payroll.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // request leave
    public Leave requestLeave(Long employeeId, LeaveRequestDTO leaveRequestDTO) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found"));

        Leave leave = new Leave();
        leave.setEmployee(employee);
        leave.setStartDate(leaveRequestDTO.getStartDate());
        leave.setEndDate(leaveRequestDTO.getEndDate() == null ? leaveRequestDTO.getStartDate() : leaveRequestDTO.getEndDate());
        leave.setLeaveType(leaveRequestDTO.getLeaveType());
        leave.setStatus(LeaveStatus.PENDING);

        return leaveRepository.save(leave);
    }

    // approve or reject leave
    public Leave approveOrRejectLeave(Long leaveId, LeaveStatus status) {
        Leave leave = leaveRepository.findById(leaveId).orElseThrow(() -> new RuntimeException("Leave request not found"));
        leave.setStatus(status);
        return leaveRepository.save(leave);
    }

    // get all pending leave requests
    public List<Leave> getPendingLeaveRequests() {
        return leaveRepository.findByStatus(LeaveStatus.PENDING);
    }

    // get all requested leaves for employees
    public List<Leave> getLeavesByEmployee(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId).orElseThrow(() -> new RuntimeException("Employee not found"));
        return leaveRepository.findByEmployee(employee);
    }
}