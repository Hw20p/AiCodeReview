package com.aicodegem.model;

import jakarta.persistence.*; // JPA 어노테이션을 가져오기 위한 임포트
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity // JPA 엔티티임을 나타내는 어노테이션
@Table(name = "ranking") // 데이터베이스의 테이블 이름을 설정
public class Ranking {

    @Id // 기본 키를 나타내는 어노테이션
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 증가 방식의 기본 키 생성 전략
    @Column(name = "user_id")
    private Long id; // 기본 키 필드

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false) // 외래 키 설정
    private User user;

    @Column(nullable = false) // NOT NULL 제약 조건을 설정
    private int userRank; // 순위 필드

    private int totalScore; // 총 점수 필드 (nullable)

    private LocalDate updateDate; // 업데이트 날짜 필드

    // User 엔티티의 userId를 반환하는 메소드 추가
    public Long getUserId() {
        return (this.user != null) ? this.user.getId() : null; // user가 null이면 null 반환
    }

    public int getRank() {
        return this.userRank; // userRank 값을 반환
    }

    // User 객체가 null일 수 있도록 생성자 수정
    public Ranking(Long id, User user, Integer userRank, Integer totalScore, LocalDate updateDate) {
        this.id = (id != null) ? id : 0; // 기본값 설정
        this.user = user; // user는 null일 수 있음, 필요 시 null 처리 추가
        this.userRank = (userRank != null) ? userRank : 0; // 기본값 설정
        this.totalScore = (totalScore != null) ? totalScore : 0; // 기본값 설정
        this.updateDate = (updateDate != null) ? updateDate : LocalDate.now(); // 기본값 설정
    }

}
