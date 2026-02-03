package com.kopylova.FanGroupApp.api;

import com.kopylova.FanGroupApp.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartService.CartItemResponse> getCart(Principal principal) {
        return cartService.getCart(principal);
    }


    @PostMapping("/items/{merchId}")
    public ResponseEntity<?> addOne(@PathVariable Long merchId, Principal principal) {
        cartService.addOne(principal, merchId);
        return ResponseEntity.ok().build();
    }


    @PutMapping("/items/{merchId}")
    public ResponseEntity<?> setQty(
            @PathVariable Long merchId,
            @RequestBody CartService.SetQtyRequest req,
            Principal principal
    ) {
        cartService.setQty(principal, merchId, req.qty());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items/{merchId}")
    public ResponseEntity<?> remove(@PathVariable Long merchId, Principal principal) {
        cartService.removeItem(principal, merchId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<?> clear(Principal principal) {
        cartService.clear(principal);
        return ResponseEntity.ok().build();
    }
}