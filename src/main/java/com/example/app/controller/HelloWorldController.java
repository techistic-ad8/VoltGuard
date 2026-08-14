package com.example.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloWorldController {
    @GetMapping("/")
    public String home() {
        return "<html>" +
               "<head><title>VoltGuard - Running</title>" +
               "<style>" +
               "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; }" +
               ".card { text-align: center; padding: 2.5rem; background: #1e293b; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); max-width: 500px; border: 1px solid #334155; }" +
               "h1 { color: #38bdf8; margin-bottom: 1rem; font-size: 2.2rem; }" +
               "p { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; }" +
               ".btn { display: inline-block; background: #38bdf8; color: #0f172a; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: bold; transition: background 0.2s; }" +
               ".btn:hover { background: #0ea5e9; }" +
               "</style>" +
               "</head>" +
               "<body>" +
               "<div class='card'>" +
               "<h1>VoltGuard is Running! ⚡</h1>" +
               "<p>Your Spring Boot application has started successfully on port 8080.</p>" +
               "<a class='btn' href='/hello'>Go to Hello Endpoint</a>" +
               "</div>" +
               "</body>" +
               "</html>";
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Spring Boot is working successfully!";
    }
}
