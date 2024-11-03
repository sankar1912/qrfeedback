package com.example.feeedbacksystem;

import com.example.feeedbacksystem.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser (String managerId, String password) {
        User user = new User(managerId, password);
        return userRepository.save(user);
    }

    public User loginUser (String managerId, String password) {
        User user = userRepository.findByManagerId(managerId);
        if (user != null && password.equals(user.getPassword())) {
            return user;
        }
        return null; // Invalid credentials
    }

    public User userbymanagerIdAndPassword(String managerId, String password) {
        return loginUser(managerId, password);
    }
}