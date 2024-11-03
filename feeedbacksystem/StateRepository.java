package com.example.feeedbacksystem;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Repository for the 'states' table
public interface StateRepository extends JpaRepository<States, Integer> {
    // Find a state by its name
    Optional<States> findByStateName(String stateName);
}

