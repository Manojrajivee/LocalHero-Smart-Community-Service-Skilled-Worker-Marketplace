package com.localhero.config;

import com.localhero.entity.User;
import com.localhero.entity.Worker;
import com.localhero.repository.UserRepository;
import com.localhero.repository.WorkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("====================================================");
        System.out.println("RUNNING DATABASE SEEDER CHECK...");

        // 1. Seed Customer
        if (!userRepository.existsByEmail("customer@hero.com")) {
            System.out.println("Seeding default customer account...");
            User customer = User.builder()
                    .name("Test Customer")
                    .email("customer@hero.com")
                    .password(passwordEncoder.encode("password"))
                    .role("CUSTOMER")
                    .phone("1234567890")
                    .address("123 Customer St")
                    .emailVerified(true)
                    .blocked(false)
                    .build();
            userRepository.save(customer);
        }

        // 2. Seed Admin
        if (!userRepository.existsByEmail("admin@hero.com")) {
            System.out.println("Seeding default admin account...");
            User admin = User.builder()
                    .name("Test Admin")
                    .email("admin@hero.com")
                    .password(passwordEncoder.encode("password"))
                    .role("ADMIN")
                    .phone("5555555555")
                    .address("Admin HeadQuarters")
                    .emailVerified(true)
                    .blocked(false)
                    .build();
            userRepository.save(admin);
        }

        // 3. Seed Worker
        if (!userRepository.existsByEmail("worker@hero.com")) {
            System.out.println("Seeding default worker account...");
            User workerUser = User.builder()
                    .name("Test Worker")
                    .email("worker@hero.com")
                    .password(passwordEncoder.encode("password"))
                    .role("WORKER")
                    .phone("9876543210")
                    .address("456 Worker Rd")
                    .emailVerified(true)
                    .blocked(false)
                    .build();
            workerUser = userRepository.save(workerUser);

            Worker worker = Worker.builder()
                    .user(workerUser)
                    .skill("Plumbing, Electrical")
                    .category("Plumbing")
                    .hourlyRate(45.0)
                    .description("Professional plumbing and basic electrical services.")
                    .verified(true)
                    .status("APPROVED")
                    .licenseNumber("LIC-12345")
                    .location("Metropolis")
                    .experience("5 years")
                    .build();
            workerRepository.save(worker);
        }

        System.out.println("DATABASE SEEDER CHECK COMPLETE.");
        System.out.println("====================================================");
    }
}
