package com.example.feeedbacksystem;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "branch")
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "branch_name", nullable = false) // Representing the branch name
    private String branchName;

    @ManyToOne
    @JoinColumn(name = "bank_id", nullable = false) // Make bank a required field
    private Bank bank;

    @ManyToOne
    @JoinColumn(name = "district_id", nullable = false) // Make district a required field
    private Districts district;

    @Column(nullable = false, unique = true)
    private String ifscCode;

    private String address;

    // Add other fields as needed
}
