package com.budgetplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.budgetplanner")
@EnableJpaRepositories("com.budgetplanner.repository")
@EntityScan("com.budgetplanner.model")
public class BudgetPlannerBackendApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(BudgetPlannerBackendApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BudgetPlannerBackendApplication.class);
    }
}
