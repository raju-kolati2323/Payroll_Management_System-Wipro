package com.example.payroll.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.payroll.dto.JobRoleRequestDTO;
import com.example.payroll.dto.JobRoleResponseDTO;
import com.example.payroll.model.*;
import com.example.payroll.repository.*;

@Service
public class JobRoleService {

    @Autowired
    private JobRoleRepository jobRoleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    //get all jobs
    public List<JobRoleResponseDTO> getAllJobRoles() {
        List<JobRole> jobRoles = jobRoleRepository.findAll();

        return jobRoles.stream().map(job -> {
            JobRoleResponseDTO dto = new JobRoleResponseDTO();
            dto.setJobrole_id(job.getJobrole_id());
            dto.setJobrole(job.getJobrole());
            dto.setDepartmentName(job.getDepartment().getName());
            return dto;
        }).toList();
    }

    //create jobrole
    public JobRole createJobRole(JobRoleRequestDTO dto) {
        Department department = departmentRepository.findById(dto.getDepartmentId()).orElseThrow(() -> new RuntimeException("Department not found"));
        JobRole jobRole = new JobRole();
        jobRole.setJobrole(dto.getJobrole());
        jobRole.setDepartment(department);
        return jobRoleRepository.save(jobRole);
    }

    //update job role
    public JobRole updateJobRole(Long id, JobRoleRequestDTO dto) {
        JobRole jobRole = jobRoleRepository.findById(id).orElseThrow(() -> new RuntimeException("JobRole not found with id: " + id));
        Department department = departmentRepository.findById(dto.getDepartmentId()).orElseThrow(() -> new RuntimeException("Department not found"));

        jobRole.setJobrole(dto.getJobrole());
        jobRole.setDepartment(department);
        return jobRoleRepository.save(jobRole);
    }

    //delete job role
    public void deleteJobRole(Long id) {
        JobRole jobRole = jobRoleRepository.findById(id).orElseThrow(() -> new RuntimeException("JobRole not found with id: " + id));
        List<Employee> employees = employeeRepository.findByDesignationAndDepartment(
                jobRole.getJobrole().toLowerCase().trim(),
                jobRole.getDepartment());
        if (!employees.isEmpty()) {
            throw new RuntimeException("This job role is linked with employees and cannot be deleted. Please unlink them first.");
        }

        jobRoleRepository.delete(jobRole);
    }
}