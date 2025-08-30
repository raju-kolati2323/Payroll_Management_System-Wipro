package com.example.payroll.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
@Entity
@Table(name = "jobrole")
public class JobRole {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobrole_id;

    @NotBlank(message = "Please provide the job role name")
    private String jobrole;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

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

    public Department getDepartment() {
        return department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }
}
