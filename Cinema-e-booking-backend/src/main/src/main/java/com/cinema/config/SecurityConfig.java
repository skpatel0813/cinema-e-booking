// src/main/java/com/cinema/config/SecurityConfig.java

package com.cinema.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and() // Enable CORS using global configuration
            .csrf().disable() // Disable CSRF for simplicity; consider enabling it for production
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Allow all requests without authentication
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
