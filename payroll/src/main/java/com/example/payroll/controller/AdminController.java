package com.example.payroll.controller;

import com.example.payroll.dto.*;
import com.example.payroll.model.*;
import com.example.payroll.repository.EmployeeRepository;
import com.example.payroll.repository.PayrollRunRepository;
import com.example.payroll.service.*;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@SecurityRequirement(name = "BearerAuth")
@RestController
@RequestMapping("/api/v1")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private EmployeeService employeeService;
    
    @Autowired
    private EmployeeRepository employeeRepository;
    
    @Autowired
    private DepartmentService departmentService;
    
    @Autowired
    private JobRoleService jobRoleService;
    
    @Autowired
    private PayrollService payrollService;
    
    @Autowired
    private PayrollRunRepository payrollRunRepository;
    
    @Autowired
    private SalaryStructureService salaryStructureService;
    
    @Autowired
    private LeaveService leaveService;

    
    //Auth & Users
    
    //create new user
    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            createdUser.setPassword(null);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // update user active status
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable("id") Long id, @RequestParam("active") boolean active) {
        try {
            User updatedUser = userService.updateUserStatus(id, active);
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    
    // EMPLOYEES
    
    //get list of employees
    @GetMapping("/employees")
    public ResponseEntity<?> getAllEmployees() {
        try {
            List<Employee> employees = employeeService.getEmployees();
            
            employees.forEach(employee -> {
                if (employee.getUser() != null) {
                    employee.getUser().setPassword(null);
                }
            });
            return ResponseEntity.ok(employees);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "No employees found"));
        }
    }
    
    
 // Create a new employee record
    @PostMapping("/employees")
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeDataDTO employeeData) {
        try {
            Employee employee = employeeService.createEmployee(employeeData);
            return ResponseEntity.status(HttpStatus.CREATED).body(employee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Update employee details by id
    @PutMapping("/employees/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDataDTO employeeData) {
        try {
            Employee updatedEmployee = employeeService.updateEmployee(id, employeeData);
            return ResponseEntity.ok(updatedEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
    
    
 //SALARY STRUCTURE
    
    // get salary structure of a specific employee
    @GetMapping("/employees/{id}/salary-structures")
    public ResponseEntity<?> getSalaryStructure(@PathVariable Long id) {
        try {
            SalaryStructure salaryStructure = salaryStructureService.getSalaryStructureByEmployeeId(id);
            return ResponseEntity.ok(salaryStructure);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }
    

    // create or update new salary-structure to an employee
    @PostMapping("/employees/{id}/salary-structures")
    public ResponseEntity<?> createOrUpdateSalaryStructure(@PathVariable Long id, @RequestBody SalaryStructureDTO salaryStructureDTO) {
        try {
            Employee employee = employeeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Employee not found"));

            SalaryStructure salaryStructure = salaryStructureService.createOrUpdateSalaryStructure(employee, salaryStructureDTO);
            return ResponseEntity.ok(salaryStructure);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
    
    
    //Department
    
    // get all departments
    @GetMapping("/departments")
    public ResponseEntity<?> getAllDepartments() {
        try {
            List<Department> departments = departmentService.getAllDepartments();
            return ResponseEntity.ok(departments);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    // create department
    @PostMapping("/departments")
    public ResponseEntity<?> createDepartment(@RequestBody Department department) {
    	try {
            Department createdDepartment = departmentService.createDepartment(department);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    // edit department
    @PutMapping("/departments/{id}")
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody Department departmentDetails) {
        try {
            Department updatedDepartment = departmentService.updateDepartment(id, departmentDetails);
            return ResponseEntity.ok(updatedDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE department
    @DeleteMapping("/departments/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        try {
            String message = departmentService.deleteDepartment(id);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
    
    
    //Job ROLE
    
    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobRoles() {
        List<JobRoleResponseDTO> jobRoles = jobRoleService.getAllJobRoles();
        if (jobRoles.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "No job roles found"));
        }
        return ResponseEntity.ok(jobRoles);
    }

    @PostMapping("/jobs")
    public ResponseEntity<?> createJobRole(@RequestBody JobRoleRequestDTO jobRoleDTO) {
        try {
            JobRole jobRole = jobRoleService.createJobRole(jobRoleDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(jobRole);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/jobs/{id}")
    public ResponseEntity<?> updateJobRole(@PathVariable Long id, @RequestBody JobRoleRequestDTO jobRoleDTO) {
        try {
            JobRole jobRole = jobRoleService.updateJobRole(id, jobRoleDTO);
            return ResponseEntity.ok(jobRole);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJobRole(@PathVariable Long id) {
        try {
            jobRoleService.deleteJobRole(id);
            return ResponseEntity.ok(Map.of("message", "Job role deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }
    
    
    //LEAVES
    
    //get all pending leaves
    @GetMapping("/leaves/pending")
    public ResponseEntity<?> getPendingLeaveRequests() {
        try {
            List<Leave> pendingLeaves = leaveService.getPendingLeaveRequests();
            List<LeaveResponseDTO> responseDTOs = pendingLeaves.stream()
                    .map(this::mapToResponseDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(responseDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    //approve or reject leave
    @PutMapping("/leaves/{leaveId}")
    public ResponseEntity<?> approveOrRejectLeave(@PathVariable Long leaveId, @RequestParam LeaveStatus status) {
        try {
            Leave leave = leaveService.approveOrRejectLeave(leaveId, status);
            LeaveResponseDTO responseDTO = mapToResponseDTO(leave);
            return ResponseEntity.ok(responseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
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
    
    
    //PAYROLL
    
    //create a payroll run
    @PostMapping("/payroll/runs")
    public ResponseEntity<?> createPayrollRun(@RequestParam int year, @RequestParam int month) {
        PayrollRun payrollRun = payrollService.createPayrollRun(year, month);
        return ResponseEntity.status(HttpStatus.CREATED).body(payrollRun);
    }
    
    //get all payroll runs
    @GetMapping("/payroll/runs")
    public ResponseEntity<?> getAllPayrollRuns() {
        List<PayrollRun> runs = payrollRunRepository.findAll(Sort.by(Sort.Direction.DESC, "runDate"));
        return ResponseEntity.ok(runs);
    }

    //process a payroll run
    @PostMapping("/payroll/runs/{id}/process")
    public ResponseEntity<?> processPayrollRun(@PathVariable Long id) {
        payrollService.processPayrollRun(id);
        return ResponseEntity.ok(Map.of("message", "Payroll run processed successfully"));
    }

    //lock payroll
    @PostMapping("/payroll/runs/{id}/lock")
    public ResponseEntity<?> lockPayrollRun(@PathVariable Long id) {
        payrollService.lockPayrollRun(id);
        return ResponseEntity.ok(Map.of("message", "Payroll run locked successfully"));
    }

    //get payroll data
    @GetMapping("/payroll/runs/{id}/items")
    public ResponseEntity<?> getPayrollRunItems(@PathVariable Long id) {
        List<Payroll> payrolls = payrollService.getPayrollRunItems(id);
        return ResponseEntity.ok(payrolls);
    }

    
    // REPORTS

    // generate and get payroll summary report for a period (from and to month/year)
    @GetMapping("/reports/payroll-summary")
    public ResponseEntity<?> generatePayrollSummary(@RequestParam int fromYear, @RequestParam int fromMonth,
                                                    @RequestParam int toYear, @RequestParam int toMonth) {
        try {
            double totalPayroll = 0;
            List<Employee> employees = employeeRepository.findAll();
            int months = calculateMonthDifference(fromYear, fromMonth, toYear, toMonth);

            for (Employee employee : employees) {
                totalPayroll += employee.getSalary() * months; // Calculate for the months in range
            }

            return ResponseEntity.ok(Map.of("totalPayroll", totalPayroll, "employeeCount", employees.size()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    //generate and get a report on department costs for a given period
    @GetMapping("/reports/department-cost")
    public ResponseEntity<?> getAllEmployeesWithDepartmentCost(@RequestParam int fromYear, @RequestParam int fromMonth,@RequestParam int toYear, @RequestParam int toMonth) {
        try {
            Map<Long, Double> departmentCost = new HashMap<>();
            List<Employee> employees = employeeRepository.findAll();

            // Calculate salary for the number of months between the given range
            int monthsDifference = calculateMonthDifference(fromYear, fromMonth, toYear, toMonth);
            for (Employee employee : employees) {
                double totalSalary = employee.getSalary() * monthsDifference;
                departmentCost.put(employee.getDepartment().getDepartment_id(), totalSalary);
            }
            return ResponseEntity.ok(departmentCost);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", e.getMessage()));
        }
    }

    // Calculate month difference between two dates
    private int calculateMonthDifference(int fromYear, int fromMonth, int toYear, int toMonth) {
        LocalDate fromDate = LocalDate.of(fromYear, fromMonth, 1);
        LocalDate toDate = LocalDate.of(toYear, toMonth, 1);
        return (int) ChronoUnit.MONTHS.between(fromDate, toDate) + 1;
    }

}
