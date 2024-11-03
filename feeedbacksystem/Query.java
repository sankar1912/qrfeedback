package com.example.feeedbacksystem;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Query {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bank_name")
    private String bankName;

    private String branch;
    private String contact;
    private String date;
    private String description;
    private String district;
    private String email;
    private String filename;

    @Column(name = "ref_no")
    private String refNo;

    private String states;
    @Override
    public String toString() {
        return "Query{" +
                "id=" + id +
                ", bankName='" + bankName + '\'' +
                ", branch='" + branch + '\'' +
                ", contact='" + contact + '\'' +
                ", date='" + date + '\'' +
                ", description='" + description + '\'' +
                ", district='" + district + '\'' +
                ", email='" + email + '\'' +
                ", filename='" + filename + '\'' +
                ", refNo='" + refNo + '\'' +
                ", states='" + states + '\'' +
                '}';
    }

    // Getters and Setters
}
