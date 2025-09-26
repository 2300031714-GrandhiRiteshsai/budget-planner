package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@EnableJpaRepositories("com.budgetplannerbackend.repository")
@EntityScan("com.budgetplannerbackend.model")
@SpringBootApplication(scanBasePackages = "com.budgetplannerbackend")
public class BudgetPlannerBackendApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BudgetPlannerBackendApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(BudgetPlannerBackendApplication.class, args);
    }
}
