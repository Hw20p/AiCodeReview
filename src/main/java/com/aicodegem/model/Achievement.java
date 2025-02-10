package com.aicodegem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "achievement")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long Id;

    @Column(name = "achievement_name", nullable = false)
    private String achievementName; // 업적 이름

    @Column(name = "achievement_desc")
    private String achievementDesc; // 업적 설명

    @Column(name = "criteria")
    private String criteria; // 기준 필드 추가

    // Lombok이 자동으로 생성한 생성자, Getter, Setter
}
