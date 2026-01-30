package com.kopylova.FanGroupApp.api;

import com.kopylova.FanGroupApp.domain.MerchItem;
import com.kopylova.FanGroupApp.repo.MerchItemRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/merch")
public class AdminMerchController {

    private final MerchItemRepository repo;

    public AdminMerchController(MerchItemRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public MerchItem create(@RequestBody MerchItem item) {
        return repo.save(item);
    }

    @PutMapping("/{id}")
    public MerchItem update(@PathVariable Long id, @RequestBody MerchItem item) {
        var existing = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Merch item not found"));


        existing.setTitle(item.getTitle());
        existing.setDescription(item.getDescription());
        existing.setPrice(item.getPrice());
        existing.setImageUrl(item.getImageUrl());

        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
