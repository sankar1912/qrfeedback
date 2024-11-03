package com.example.feeedbacksystem;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Entity
@Data
public class Bank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "bank_name", nullable = false)  // Ensure bank name is not null
    private String bankName;

    @Column(nullable = false, unique = true)
    private String ifscCode;

    @RestController
    @RequestMapping("/")
    public static class ApiController {

        @Autowired
        private StateRepository stateRepository;

        @Autowired
        private DistrictRepository districtRepository;

        @Autowired
        private BankRepository bankRepository;

        @Autowired
        private BranchRepository branchRepository;

    }
}

