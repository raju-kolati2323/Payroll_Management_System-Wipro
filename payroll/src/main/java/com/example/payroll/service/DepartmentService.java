package com.example.payroll.service;

import com.example.payroll.model.Department;
import com.example.payroll.repository.DepartmentRepository;
import com.example.payroll.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    // get all departments
    public List<Department> getAllDepartments() {
        List<Department> departments = departmentRepository.findAll();
        if (departments.isEmpty()) {
            throw new RuntimeException("No departments found");
        }
        return departments;
    }

    // create a new department
    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    // update department
    public Department updateDepartment(Long departmentId, Department departmentDetails) {
        Department department = departmentRepository.findById(departmentId).orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
        department.setName(departmentDetails.getName());
        return departmentRepository.save(department);
    }

    // delete department if not linked with any employeess
    public String deleteDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId).orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
       if (employeeRepository.existsByDepartment(department)) {
            return "Department is linked with employees, so it cannot be deleted. Please unlink all employees first.";
        }
        departmentRepository.delete(department);
        return "Department deleted successfully.";
    }
}
