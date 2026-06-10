package com.localhero.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String email, String token) {
        String link = "http://localhost:8080/api/auth/verify?token=" + token;

        // Always print the verification link to console for easy local testing
        System.out.println("====================================================");
        System.out.println("LOCALHERO EMAIL VERIFICATION LINK FOR: " + email);
        System.out.println(link);
        System.out.println("====================================================");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("LocalHero Email Verification");
            message.setText(
                "Welcome to LocalHero.\n\n" +
                "Click the link below to verify your account:\n" +
                link
            );
            mailSender.send(message);
            log.info("Verification email sent successfully to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}. Error: {}", email, e.getMessage());
            System.out.println("SMTP is not configured or failed. Use the verification link printed above to manually verify the account.");
        }
    }
}
