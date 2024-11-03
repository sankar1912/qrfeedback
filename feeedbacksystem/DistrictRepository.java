package com.example.feeedbacksystem;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

// Repository for the 'districts' table
public interface DistrictRepository extends JpaRepository<Districts, Integer> {
    // Find all districts belonging to a particular state
    List<Districts> findAllByState(States state);
    Optional<Districts> findByDistrictName(String districtName);

    List<Districts> findDistrictsByStateId(int id);
}

