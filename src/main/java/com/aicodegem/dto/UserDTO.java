package com.aicodegem.dto;

public class UserDTO {
    private String username;
    private String password;
    private String email;
    private String phoneNum;

    // Constructor, Getters and Setters
    public UserDTO() {
    }

    public UserDTO(String username, String password, String email, String phoneNum) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNum = phoneNum; // 수정된 부분
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
}