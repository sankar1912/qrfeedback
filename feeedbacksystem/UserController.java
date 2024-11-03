package com.example.feeedbacksystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@CrossOrigin
public class UserController {

    @Autowired
    UserRepository userRepository;
    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User loginUser ) {
        // Fetch the user from the database using managerId


        User user = userRepository.findByManagerId(loginUser .getManagerId());

        // Validate user credentials
        if (user != null && user.getPassword().equals(loginUser .getPassword())) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(401).body(user);
        }
    }
}