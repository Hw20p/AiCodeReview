import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  // 로그인 폼 데이터 (아이디, 비밀번호)를 상태로 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // 입력 필드의 변경을 처리하고 상태를 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,    // 특정 필드만 동적으로 업데이트
    }));
  };

  // 폼 제출을 처리 (로그인)
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log("프론트에서의 데이터 : ", formData);

      // 응답이 성공하지 않으면 에러 메시지 처리
      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || "An error occurred";
        } catch {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      // 로그인 성공 시, 받은 토큰을 로컬 스토리지에 저장
      const result = await response.json();
      localStorage.setItem('token', result.token);
      alert('로그인 성공!');
      window.location.href = '/main';
    } catch (error) {
      console.error('Error:', error);
      alert('아이디나 패스워드를 잘못 입력하셨습니다.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">로그인</h2>
        <p className="login-description">
          로그인 아이디와 비밀번호를 입력하신 후<br />
          <strong>로그인</strong> 버튼을 클릭하세요.
        </p>
        <div className="login-input-container">
          <input
            type="text"
            name="username"
            placeholder="아이디를 입력하세요"
            value={formData.username}
            onChange={handleChange}
            required
            className="login-input"
          />
        </div>
        <div className="login-input-container">
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
          />

        </div>
        <button type="submit" className="login-button">로그인</button>
        <div className="login-footer">
          <a href="/profile-edit">아이디</a>
          <a href="/profile-edit">/비밀번호 찾기</a> | <a href="/signup">회원가입</a>
        </div>
      </form>

    </div>
  );
};

export default Login;
