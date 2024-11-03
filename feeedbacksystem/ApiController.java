package com.example.feeedbacksystem;


import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/")
@CrossOrigin
public class ApiController {
    @Autowired
    private StateRepository stateRepository;

    @Autowired
    private DistrictRepository districtRepository;

    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private BranchRepository branchRepository;
    // Your branch repository
    @Autowired
    private FeedbackRepository feedbackRepository; // Your feedback repository
    @Autowired
    private QueryRepository queryRepository;
    @GetMapping("/branchbybank")
    public List<Branch> getBranchesByBankName(@RequestParam String bankName) {
        return branchRepository.findByBank_BankName(bankName);
    }

    @GetMapping("/feedbackbybank")
    public List<Feedback> getFeedbackByBankName(@RequestParam String bankName) {
        return feedbackRepository.findByBankName(bankName); // Implement this method in your repository
    }
    // Get all states
    @GetMapping("/states")
    public List<States> getStates() {
        return stateRepository.findAll();
    }

    // Get districts by state name
    @GetMapping("/districts/{stateName}")
    public List<Districts> getDistrictsByState(@PathVariable String stateName) {
        // Find the state by name to get the state ID
        States state = stateRepository.findByStateName(stateName)
                .orElseThrow(() -> new RuntimeException("State not found"));

        // Use the state ID to find all districts associated with the state
        return districtRepository.findDistrictsByStateId(state.getId());
    }


    // Get banks by district name and IFSC code
    @GetMapping("/branches")
    public List<Branch> getBranchesByDistrictName(@RequestParam String districtName) {
        // Find district by name
        Districts districts = districtRepository.findByDistrictName(districtName)
                .orElseThrow(() -> new RuntimeException("District not found"));

        // Find branches by district ID
        return branchRepository.findAllByDistrict_Id(districts.getId());
    }
    @GetMapping("/banks")
    public List<Bank> getBanks(
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ifsc) {

        Long districtId = null;

        // If district parameter is provided, find the corresponding district ID
        if (district != null && !district.isEmpty()) {
            Optional<Districts> optionalDistrict = districtRepository.findByDistrictName(district);
            if (optionalDistrict.isPresent()) {
                districtId = (long) optionalDistrict.get().getId();
            } else {
                throw new RuntimeException("District not found");
            }
        }

        // Pass either `districtId` or `ifsc` (or both) to the repository query
        return bankRepository.findBanksByDistrictAndIfsc(districtId, (ifsc != null && !ifsc.isEmpty()) ? ifsc : null);
    }
}
