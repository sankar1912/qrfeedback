package com.example.feeedbacksystem;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@Setter
@Getter
@Entity // Ensure this matches your database table name
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long branchId;
    private String userFeedback;

    private Integer rating;

    private LocalDateTime createdAt;

    private Double avgReview;
    private String bankName;

    private String email;

    private String name;

    public Feedback() {
    }

    // Getters and Setters

}

