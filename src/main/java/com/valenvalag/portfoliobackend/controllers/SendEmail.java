package com.valenvalag.portfoliobackend.controllers;

import com.valenvalag.portfoliobackend.entities.MailSender;
import com.valenvalag.portfoliobackend.models.Email;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SendEmail {

    JavaMailSenderImpl emailSender = new MailSender().getJavaMailSender();

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@baeldung.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    @PostMapping("/sendEmail")
    public ResponseEntity<String> sendEmail(@RequestBody Email email){
        sendSimpleMessage("val.agarcia08@gmail.com", email.subject, email.message);

        return ResponseEntity.ok().body("ok");
    }

}
