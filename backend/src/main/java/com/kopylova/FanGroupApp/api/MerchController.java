package com.kopylova.FanGroupApp.api;


import com.kopylova.FanGroupApp.repo.MerchItemRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/merch")
public class MerchController {
    private final MerchItemRepository repo;

    public MerchController(MerchItemRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<?> list() {
        return repo.findAll();
    }

}
