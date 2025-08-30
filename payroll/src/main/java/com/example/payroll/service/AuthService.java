package com.example.payroll.service;

import com.example.payroll.model.User;
import com.example.payroll.repository.UserRepository;
import com.example.payroll.security.JwtUtil;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    //login
    public Map<String, Object> login(String username, String rawPassword) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.isActive()) {
            throw new RuntimeException("Your account is not active, please contact the admin");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", token);

        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("id", user.getUser_id());
        userDetails.put("username", user.getUsername());
        userDetails.put("role", user.getRole().name());

        response.put("user", userDetails);

        return response;
    }
}
