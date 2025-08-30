package com.example.payroll.dto;

public class SalaryStructureDTO {

    private Long employeeId;
    private Double employeeSalary;
    private Integer totalPaidLeavesPerYear;
    private Double taxPercentage;
    private Double salaryDeductionPerDay;
    private Double bonusAmount;


    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
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
