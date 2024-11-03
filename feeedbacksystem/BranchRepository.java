package com.example.feeedbacksystem;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


// Repository for the 'branch' table
public interface BranchRepository extends JpaRepository<Branch, Integer> {
    // Find all branches by district ID
    List<Branch> findAllByDistrict_Id(int districtId);
    List<Branch> findByBank_BankName(String bankName); // Correctly reference the bank name
}


