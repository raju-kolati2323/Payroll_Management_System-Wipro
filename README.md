# Payroll Management System

## 1. Introduction
The **Payroll Management System** is a web application designed to automate employee payroll, leave management.  
The system offers **role-based access control** with two main roles: **Admin** and **Employee**.  
It ensures secure operations using **JWT (JSON Web Tokens)** for authentication.

### Technology Stack
- **Backend:** Java, Spring Boot, Spring Security (JWT), MySQL, JPA/Hibernate  
- **Frontend:** React, React Router, Axios, React Toastify, Bootstrap, JWT Authentication  

---

## 2. Overview
This system provides a secure, efficient platform for managing employee payrolls, leave requests, departments, job roles, and payroll reports.

### 2.1 Authentication
- **Login:** Users log in with username & password (only if their user status is active) -> receive JWT token.  
- **Roles:** Admin and Employee.  
- **Access Control:** Endpoints protected based on user role.  

### 2.2 Employee Management
- **Admin:** Create, view, and update employee profiles, also can toggle the users' active status.  
- **Employee:** View personal profile only.  

### 2.3 Department & Job Role Management
- **Admin:** CRUD operations for departments and job roles.  
- **Validation:** Department/job role cannot be deleted if linked to employees.  

### 2.4 Salary & Payroll Management
- **Salary Structure:** Basic salary, tax, bonus, deductions.  
- **Payroll Run:** Generate monthly payroll with calculations.  
- **Employee View:** View payroll history by month/year.  

### 2.5 Leave Management
- **Employee:** Request leave.  
- **Admin:** Approve or reject leave.  

### 2.6 Payroll Reports
- **Payroll Summary:** Retrieve total payroll over a period.  
- **Department Report:** Retrieve payroll cost per department.  

---

## 3. Security Measures
- **JWT Tokens:** Protect API endpoints.  
- **Password Encryption:** Stored securely with BCrypt.  
- **Role-Based Access Control:** Separate dashboards for Admin vs Employee.  

---

## 4. API Endpoints

### Authentication
- `POST /auth/login` -> Login & receive JWT  

### User & Common
- `GET /users/me` -> Get cuurrent logged-in user profile  
- `GET /employees/{id}` -> Get employee details by ID  

### User Management (Admin)
- `POST /users` -> Create new user (provides login credentials)
- `PATCH /users/{id}/status` -> Activate/deactivate user  

### Employee Management (Admin)
- `POST /employees` -> Add employee  
- `GET /employee` -> List employees  
- `PUT /employees/{id}` -> Update employee  
- `POST /employees/{id}/salary-structure` -> Assign new salary structure  
- `GET /employees/{id}/salary-structure` -> View salary structure  

### Department Management (Admin)
- `GET /departments` -> List departments  
- `POST /departments` -> Create department  
- `PUT /departments` -> Update department  
- `DELETE /departments/{id}` -> Delete department  

### Job Role Management (Admin)
- `GET /jobs` -> List job roles  
- `POST /jobs` -> Create job role  
- `PUT /jobs` -> Update job role  
- `DELETE /jobs/{id}` -> Delete job role  

### Leave Management
- `GET /leaves/pending` -> Pending requests (Admin)  
- `PUT /leaves/{leaveId}` -> Approve/reject (Admin)  
- `POST /leaves` -> Request leave (Employee)  
- `GET /leaves` -> View employee leave history (Employee)

### Payroll Management
- `GET /payroll/my/{year}/{month}` -> Employee payroll view  
- `POST /payroll/runs` -> Create payroll run (Admin)  
- `POST /payroll/runs/{id}/process` -> Process payroll (Admin)  
- `GET /payroll/runs/{id}/items` -> View payroll run data (Admin)  
- `POST /payroll/runs/{id}/lock` -> Lock payroll run (Admin)  

### Reports (Admin)
- `GET /reports/payroll-summary` -> Payroll summary  
- `GET /reports/department-cost` -> Department cost report  

---

## 5. Frontend Dashboard Features

### Employee Dashboard
- **Dashboard:** Personal details, account info, leave statistics  
- **Leave Management:** Request & view leaves  
- **Payroll:** Current and past payroll details  

### Admin Dashboard
- **Dashboard:** Overview of employees, departments, job roles, user status  
- **Employee Management:** View, create, update employees with user(login) credentials, employee details and salary-structure 
- **Department Management:** Add, edit, delete departments  
- **Job Management:** Add, edit, delete job roles  
- **Leave Management:** Approve/reject requests  
- **Payroll Management:** Run payroll, view payroll data, generate and get reports  

---

## 6. Error Handling
Handled via **React Toastify** with toast notifications for:
- Unauthorized access  
- Failed API calls  

---

## 7. Conclusion
The **Payroll Management System** provides seamless management of employee data, payroll, leave requests, and departmental reports.  
It ensures **security** through role-based access, **encrypted passwords**, and **JWT authentication**.  
- **Admins:** Full control over employee management, departments, job roles, leave approvals, payroll and reports.  
- **Employees:** Manage profile, leave requests, and view payroll.  
