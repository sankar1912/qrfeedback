package com.example.feeedbacksystem;

import com.example.feeedbacksystem.Query;
import com.example.feeedbacksystem.QueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping("/")
public class QueryController {



    @Autowired
    private final QueryRepository queryRepository;

    public QueryController(QueryRepository queryRepository) {
        this.queryRepository = queryRepository;
    }
    @PostMapping("/submitquery")
    public ResponseEntity<?> submitQuery(@RequestBody Query query) {
        try {
            System.out.println(query.toString());
            queryRepository.save(query);

            // Creating a response map to send JSON
            Map<String, String> response = new HashMap<>();
            response.put("message", "Query successfully submitted");
            return ResponseEntity.ok().body(response);

        } catch (Exception e) {
            // Logging error and returning response with 500 status
            e.printStackTrace(); // Check this in your logs
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to submit query");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
