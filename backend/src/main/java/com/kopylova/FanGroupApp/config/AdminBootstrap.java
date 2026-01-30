package com.kopylova.FanGroupApp.config;

import com.kopylova.FanGroupApp.domain.User;
import com.kopylova.FanGroupApp.repo.RoleRepository;
import com.kopylova.FanGroupApp.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminBootstrap {

    @Bean
    public org.springframework.boot.CommandLineRunner createAdmin(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder encoder,
            @Value("${app.admin.username:admin}") String adminUsername,
            @Value("${app.admin.password:admin}") String adminPassword
    ) {
        return args -> {
            if (userRepository.existsByUsername(adminUsername)) return;

            var adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new IllegalStateException("ROLE_ADMIN not found"));

            User u = new User();
            u.setUsername(adminUsername);
            u.setPassword(encoder.encode(adminPassword));
            u.getRoles().add(adminRole);

            userRepository.save(u);
        };
    }
}
