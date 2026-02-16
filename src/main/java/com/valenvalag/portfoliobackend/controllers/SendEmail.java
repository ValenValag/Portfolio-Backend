package com.valenvalag.portfoliobackend.controllers;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import com.resend.services.emails.model.CreateEmailResponse;
import com.valenvalag.portfoliobackend.models.Email;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Properties;

@RestController
public class SendEmail {

    Properties prop = new Properties();
    Resend resend = new Resend(prop.getProperty("resend.apikey"));


    @PostMapping("/sendEmail")
    public ResponseEntity<String> sendEmail(@RequestBody Email email){
        CreateEmailOptions params = CreateEmailOptions.builder()
                .from("Acme <onboarding@resend.dev>")
                .to("val.agarcia08@gmail.com")
                .subject(email.subject)
                .text(email.message)
                .build();

        try {
            CreateEmailResponse data = resend.emails().send(params);
            System.out.println(data.getId());
            return ResponseEntity.ok().body("ok");

        } catch (ResendException e) {
            return ResponseEntity.badRequest().body(e.toString());
        }

    }

}
