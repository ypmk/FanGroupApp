package com.kopylova.FanGroupApp.api.dto;

import java.util.List;

public record AdminUserDto(
        Long id,
        String username,
        boolean enabled,
        List<String> roles
) {}
