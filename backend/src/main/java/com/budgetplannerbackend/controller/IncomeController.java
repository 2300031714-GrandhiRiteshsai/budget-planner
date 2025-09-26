package com.budgetplannerbackend.controller;

import com.budgetplannerbackend.model.Income;
import com.budgetplannerbackend.repository.IncomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@CrossOrigin(origins = "http://localhost:5173")
public class IncomeController {

    @Autowired
    private IncomeRepository incomeRepository;

    @PostMapping("/add")
    public ResponseEntity<Income> addIncome(@RequestBody Income income) {
        Income saved = incomeRepository.save(income);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Income>> getIncomes(@PathVariable("userId") Long userId) {
        List<Income> incomes = incomeRepository.findByUserId(userId);
        return ResponseEntity.ok(incomes);
    }
}
