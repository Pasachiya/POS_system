// domain/entity/User.java
package com.pahana.edu.billing.domain.entity;

import com.pahana.edu.billing.domain.enums.UserType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "users")
public class User {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long userId;

  @Column(nullable=false, unique=true, length=50)
  private String username;

  @Column(nullable=false)
  private String password;

  @Column(nullable=false, unique=true)
  private String email;

  @Enumerated(EnumType.STRING)
  @Column(nullable=false, length=20)
  private UserType userType;

  @Column(nullable=false)
  private Instant createdDate;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
  private Admin admin;

  @PrePersist
  protected void onCreate() {
    if (createdDate == null) {
      createdDate = Instant.now();
    }
  }
}
