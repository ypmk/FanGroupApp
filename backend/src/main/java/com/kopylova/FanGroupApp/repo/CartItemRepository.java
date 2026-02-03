package com.kopylova.FanGroupApp.repo;

import com.kopylova.FanGroupApp.domain.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findAllByUser_IdOrderByIdDesc(Long userId);
    Optional<CartItem> findByUser_IdAndMerchItem_Id(Long userId, Long merchId);

    void deleteAllByUser_Id(Long userId);
    void deleteByUser_IdAndMerchItem_Id(Long userId, Long merchId);
}
