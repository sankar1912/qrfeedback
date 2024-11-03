package com.example.feeedbacksystem;


import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByManagerId(String managerId);
}