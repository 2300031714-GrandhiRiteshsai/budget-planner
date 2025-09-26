package com.budgetplannerbackend.controller;

import com.budgetplannerbackend.model.SavingsGoal;
import com.budgetplannerbackend.repository.SavingsGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings")
@CrossOrigin(origins = "http://localhost:5173")
public class SavingsController {

    @Autowired
    private SavingsGoalRepository savingsRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addGoal(@RequestBody SavingsGoal goal) {
        try {
            SavingsGoal saved = savingsRepository.save(goal);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to save savings goal: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getSavings(@PathVariable("userId") Long userId) {
        try {
            List<SavingsGoal> goals = savingsRepository.findByUserId(userId);
            return ResponseEntity.ok(goals);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to fetch savings goals: " + e.getMessage());
        }
    }

    @PutMapping("/addToCurrent/{goalId}")
    public ResponseEntity<?> addToCurrentAmount(
            @PathVariable("goalId") Long goalId,
            @RequestParam("amount") Double amountToAdd) {
        try {
            // Fetch the goal by ID
            SavingsGoal goal = savingsRepository.findById(goalId)
                    .orElseThrow(() -> new RuntimeException("Goal not found with id " + goalId));

            // Initialize currentAmount if null
            if (goal.getCurrentAmount() == null) {
                goal.setCurrentAmount(0.0);
            }

            // Add the specified amount
            goal.setCurrentAmount(goal.getCurrentAmount() + amountToAdd);

            // Save updated goal
            SavingsGoal updatedGoal = savingsRepository.save(goal);

            return ResponseEntity.ok(updatedGoal);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to update current amount: " + e.getMessage());
        }
    }
}
