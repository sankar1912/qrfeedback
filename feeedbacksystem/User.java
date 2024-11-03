package com.example.feeedbacksystem;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class User {

    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String managerId;
    private String password;
    private  String bankName;
    // Constructors
    public User() {}

    public User(String managerId, String password) {
        this.managerId = managerId;
        this.password = password;
    }
}