package com.example.feeedbacksystem;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class States {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String stateName;
}
