package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class RedirectController {
    @GetMapping("/admin")
    public ResponseEntity<Void> redirectToAdminHtml(HttpServletResponse response) throws IOException {
        response.sendRedirect("/admin.html");
        return ResponseEntity.status(HttpStatus.FOUND).build();
    }
}
