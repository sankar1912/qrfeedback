package com.example.feeedbacksystem;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Districts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "district_name")
    private String districtName;

    @ManyToOne
    @JoinColumn(name = "state_id")
    private States state;
}
