package com.kopylova.FanGroupApp.repo;

import com.kopylova.FanGroupApp.domain.MerchItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MerchItemRepository extends JpaRepository<MerchItem, Long> {
}