package com.kopylova.FanGroupApp.service;

import com.kopylova.FanGroupApp.domain.CartItem;
import com.kopylova.FanGroupApp.domain.MerchItem;
import com.kopylova.FanGroupApp.domain.User;
import com.kopylova.FanGroupApp.repo.CartItemRepository;
import com.kopylova.FanGroupApp.repo.MerchItemRepository;
import com.kopylova.FanGroupApp.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartRepo;
    private final UserRepository userRepo;
    private final MerchItemRepository merchRepo;

    public CartService(CartItemRepository cartRepo, UserRepository userRepo, MerchItemRepository merchRepo) {
        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
        this.merchRepo = merchRepo;
    }


    public record CartItemResponse(
            Long merchId,
            String title,
            String description,
            Integer price,
            String imageUrl,
            Integer qty
    ) {}


    public record SetQtyRequest(Integer qty) {}

    private User currentUser(Principal principal) {
        String username = principal.getName();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCart(Principal principal) {
        User user = currentUser(principal);

        return cartRepo.findAllByUser_IdOrderByIdDesc(user.getId())
                .stream()
                .map(ci -> {
                    MerchItem m = ci.getMerchItem();
                    return new CartItemResponse(
                            m.getId(),
                            m.getTitle(),
                            m.getDescription(),
                            m.getPrice(),
                            m.getImageUrl(),
                            ci.getQty()
                    );
                })
                .toList();
    }


    @Transactional
    public void addOne(Principal principal, Long merchId) {
        User user = currentUser(principal);

        CartItem existing = cartRepo.findByUser_IdAndMerchItem_Id(user.getId(), merchId).orElse(null);
        if (existing != null) {
            existing.setQty(existing.getQty() + 1);
            cartRepo.save(existing);
            return;
        }

        MerchItem merch = merchRepo.findById(merchId)
                .orElseThrow(() -> new RuntimeException("MerchItem not found: " + merchId));

        cartRepo.save(new CartItem(user, merch, 1));
    }


    @Transactional
    public void setQty(Principal principal, Long merchId, Integer qty) {
        if (qty == null) {
            throw new IllegalArgumentException("qty is required");
        }
        if (qty < 1) {
            throw new IllegalArgumentException("qty must be >= 1");
        }

        User user = currentUser(principal);

        CartItem item = cartRepo.findByUser_IdAndMerchItem_Id(user.getId(), merchId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQty(qty);
        cartRepo.save(item);
    }

    @Transactional
    public void removeItem(Principal principal, Long merchId) {
        User user = currentUser(principal);
        cartRepo.deleteByUser_IdAndMerchItem_Id(user.getId(), merchId);
    }

    @Transactional
    public void clear(Principal principal) {
        User user = currentUser(principal);
        cartRepo.deleteAllByUser_Id(user.getId());
    }
}
