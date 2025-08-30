-- Payroll Management System (Wipro Capstone Project)
create database payroll_db;

use payroll_db;

-- Users table
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Department table
CREATE TABLE department (
    department_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- JobRole table
CREATE TABLE jobrole (
    jobrole_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    jobrole VARCHAR(100) NOT NULL,
    department_id BIGINT NOT NULL,
    CONSTRAINT fk_jobrole_department FOREIGN KEY (department_id) REFERENCES department(department_id)
);

-- Employees table
CREATE TABLE employees (
    employee_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department_id BIGINT NOT NULL,
    salary DOUBLE NOT NULL,
    CONSTRAINT fk_employee_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) REFERENCES department(department_id)
);

-- Salary structure table (unchanged)
CREATE TABLE salary_structure (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    employee_salary DOUBLE NOT NULL,
    total_paid_leaves_per_year INT NOT NULL,
    tax_percentage DOUBLE,
    salary_deduction_per_day DOUBLE,
    bonus_amount DOUBLE,
    CONSTRAINT fk_salary_structure_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Leaves table (removed salary_structure_id column)
CREATE TABLE leaves (
    leave_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    leave_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_leaves_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

-- Payroll run table
CREATE TABLE payroll_runs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    run_date DATE NOT NULL,
    locked BOOLEAN NOT NULL DEFAULT FALSE
);

-- Payroll table
CREATE TABLE payroll (
    payroll_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    payroll_run_id BIGINT NOT NULL,
    basic_salary DOUBLE NOT NULL,
    deductions DOUBLE,
    bonus DOUBLE,
    net_salary DOUBLE NOT NULL,
    pay_date DATE NOT NULL,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id)
);
