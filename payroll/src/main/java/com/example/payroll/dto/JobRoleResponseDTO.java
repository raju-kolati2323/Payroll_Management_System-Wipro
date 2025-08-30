package com.example.payroll.dto;

public class JobRoleResponseDTO {

    private Long jobrole_id;
    private String jobrole;
    private String departmentName;

    public Long getJobrole_id() {
        return jobrole_id;
    }

    public void setJobrole_id(Long jobrole_id) {
        this.jobrole_id = jobrole_id;
    }

    public String getJobrole() {
        return jobrole;
    }

    public void setJobrole(String jobrole) {
        this.jobrole = jobrole;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }
}
