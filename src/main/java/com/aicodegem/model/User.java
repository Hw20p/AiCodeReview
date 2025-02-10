package com.aicodegem.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity // JPA 엔티티로 설정
@Table(name = "users") // MySQL의 "users" 테이블과 매핑
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL에서 자동 생성되는 기본 키
    @Column(name = "user_id")
    private Long id; // id 타입을 Long으로 변경

    private String username;
    private String password;
    private String email;
    private String phoneNum;
    private String role; // 사용자의 역할 필드 추가 (예: "user", "admin")

    @OneToMany(mappedBy = "user") // User와 UserAchievement의 관계 설정
    private List<UserAchievement> userAchievements; // 사용자가 달성한 업적 목록

    // 기본 생성자
    public User() {

    }

    // 모든 필드를 받는 생성자 (id는 MongoDB에서 자동으로 설정)
    public User(String username, String password, String email, String phoneNum, String role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNum = phoneNum;
        this.role = role;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    // Optional: toString() method for debugging
    @Override
    public String toString() {
        return "User{" +
                "id=" + id + // Long 타입으로 변경
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", phoneNum='" + phoneNum + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}
