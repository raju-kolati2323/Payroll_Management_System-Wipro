package com.example.payroll.dto;

public class CreateEmployeeRequest {

    private EmployeeDataDTO employee;
    private Long userId;
    private Long departmentId;

    public EmployeeDataDTO getEmployee() { 
    	return employee; 
    }
    public void setEmployee(EmployeeDataDTO employee) { 
    	this.employee = employee;
    }

    public Long getUserId() { 
    	return userId; 
    }
    public void setUserId(Long userId) { 
    	this.userId = userId; 
    }

    public Long getDepartmentId() { 
    	return departmentId; 
    }
    public void setDepartmentId(Long departmentId) { 
    	this.departmentId = departmentId; 
    }
}
