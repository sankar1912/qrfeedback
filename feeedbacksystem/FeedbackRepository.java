package com.example.feeedbacksystem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByBankName(String bankName);
    // Custom query methods (if any)
}
