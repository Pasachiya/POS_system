// domain/entity/Item.java
package com.pahana.edu.billing.domain.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "items")
public class Item {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long itemId;

  @Column(nullable=false, unique=true, length=120)
  private String itemName;

  @Column(length=60)
  private String category;

  @Column(nullable=false)
  private Double price;

  @Column(nullable=false)
  private Integer stockQuantity;
}
