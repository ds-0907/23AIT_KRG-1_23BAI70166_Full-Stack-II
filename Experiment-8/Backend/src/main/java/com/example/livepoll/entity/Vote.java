package com.example.livepoll.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "votes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"poll_id", "username"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "poll_id", nullable = false)
    private Long pollId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private Integer selectedOption; // index of the option chosen

    private LocalDateTime votedAt;

    @PrePersist
    protected void onCreate() {
        this.votedAt = LocalDateTime.now();
    }
}
