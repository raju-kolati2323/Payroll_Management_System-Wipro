package com.example.payroll.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.payroll.model.JobRole;
import com.example.payroll.model.Department;

import java.util.List;
import java.util.Optional;

public interface JobRoleRepository extends JpaRepository<JobRole, Long> {
    List<JobRole> findByDepartment(Department department);
    
    //employee
    Optional<JobRole> findByJobroleAndDepartment(String jobrole, Department department);
}
