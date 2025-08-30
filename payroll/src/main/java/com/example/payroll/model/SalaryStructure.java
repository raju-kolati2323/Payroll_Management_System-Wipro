package com.example.payroll.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "salary_structure")
public class SalaryStructure {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @NotNull(message = "Employee salary cannot be null")
    private Double employeeSalary;

    @NotNull(message = "Total paid leaves per year cannot be null")
    private Integer totalPaidLeavesPerYear;

    private Double taxPercentage;

    @NotNull(message = "Salary deduction per day cannot be null")
    private Double salaryDeductionPerDay;

    private Double bonusAmount;

    public SalaryStructure() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public Double getEmployeeSalary() {
		return employeeSalary;
	}

	public void setEmployeeSalary(Double employeeSalary) {
		this.employeeSalary = employeeSalary;
	}

	public Integer getTotalPaidLeavesPerYear() {
		return totalPaidLeavesPerYear;
	}

	public void setTotalPaidLeavesPerYear(Integer totalPaidLeavesPerYear) {
		this.totalPaidLeavesPerYear = totalPaidLeavesPerYear;
	}

	public Double getTaxPercentage() {
		return taxPercentage;
	}

	public void setTaxPercentage(Double taxPercentage) {
		this.taxPercentage = taxPercentage;
	}

	public Double getSalaryDeductionPerDay() {
		return salaryDeductionPerDay;
	}

	public void setSalaryDeductionPerDay(Double salaryDeductionPerDay) {
		this.salaryDeductionPerDay = salaryDeductionPerDay;
	}

	public Double getBonusAmount() {
		return bonusAmount;
	}

	public void setBonusAmount(Double bonusAmount) {
		this.bonusAmount = bonusAmount;
	}
}
