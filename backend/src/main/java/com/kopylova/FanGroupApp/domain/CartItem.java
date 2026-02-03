package com.kopylova.FanGroupApp.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "cart_items",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "merch_item_id"})
)
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "merch_item_id", nullable = false)
    private MerchItem merchItem;

    @Column(nullable = false)
    private Integer qty = 1;

    public CartItem() {}

    public CartItem(User user, MerchItem merchItem, Integer qty) {
        this.user = user;
        this.merchItem = merchItem;
        this.qty = qty;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public MerchItem getMerchItem() { return merchItem; }
    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }
}
