package com.example.payroll.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payroll.model.Role;
import com.example.payroll.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    User findByEmail(String email);
    List<User> findByRole(Role role);
}
