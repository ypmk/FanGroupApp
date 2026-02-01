package com.kopylova.FanGroupApp.api;

import com.kopylova.FanGroupApp.api.dto.AdminUserDto;
import com.kopylova.FanGroupApp.domain.User;
import com.kopylova.FanGroupApp.repo.RoleRepository;
import com.kopylova.FanGroupApp.repo.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUsersController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public AdminUsersController(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @GetMapping
    public List<AdminUserDto> listUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .sorted(Comparator.comparing(AdminUserDto::id))
                .toList();
    }

    @PostMapping("/{id}/grant-admin")
    @Transactional
    public AdminUserDto grantAdmin(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));

        var adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "ROLE_ADMIN not found"));

        user.getRoles().add(adminRole);
        return toDto(user);
    }

    @PostMapping("/{id}/revoke-admin")
    @Transactional
    public AdminUserDto revokeAdmin(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found"));

        var adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "ROLE_ADMIN not found"));

        user.getRoles().removeIf(r -> r.getName().equals(adminRole.getName()));
        return toDto(user);
    }

    private AdminUserDto toDto(User u) {
        var roles = u.getRoles().stream().map(r -> r.getName()).sorted().toList();
        return new AdminUserDto(u.getId(), u.getUsername(), u.isEnabled(), roles);
    }
}