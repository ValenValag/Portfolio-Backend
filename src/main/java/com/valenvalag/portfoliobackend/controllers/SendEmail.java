package com.valenvalag.portfoliobackend.controllers;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import com.valenvalag.portfoliobackend.models.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
public class SendEmail {

    @Value("${RESEND_API_KEY}")
    private String API_KEY;

    @Value("${DEST_EMAIL}")
    private String destEmail;


    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmail(@RequestBody Email email) {

        Resend resend = new Resend(API_KEY);

        if (email.getSubject() == null || email.getMessage() == null) {
            return ResponseEntity.badRequest().body(Map.of("ok", false, "msg", "no subject or no message included"));
        }

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("onboarding@resend.dev")
                .to(destEmail != null ? destEmail : "val.agarcia08@gmail.com")
                .subject(email.getSubject())
                .text(email.getMessage())
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println(data.getId());
            return ResponseEntity.ok(Map.of("ok", true));
        } catch (ResendException e) {
            return ResponseEntity.badRequest().body(Map.of("ok", false, "msg", e.toString()));
        }
    }

}
