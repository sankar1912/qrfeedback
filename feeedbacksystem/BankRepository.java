package com.example.feeedbacksystem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BankRepository extends JpaRepository<Bank, Long> {

    @Query("SELECT b FROM Bank b JOIN Branch br ON b.id = br.bank.id " +
            "WHERE (:districtId IS NULL OR br.district.id = :districtId) " +
            "AND (:ifsc IS NULL OR b.ifscCode = :ifsc)")
    List<Bank> findBanksByDistrictAndIfsc(@Param("districtId") Long districtId, @Param("ifsc") String ifsc);
}
