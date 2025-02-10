import React, { useState } from 'react';
import './SignUp.css';

const SignUp = () => {
  // 회원가입 폼 데이터 상태 관리 (이메일, 사용자명, 비밀번호, 전화번호)
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    phoneNum: '',
  });

  // 입력 필드 값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 회원가입 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      console.log(formData)

      // 응답이 성공적이지 않으면 에러 처리
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

      // 회원가입 성공 시 텍스트 응답 처리
      const result = await response.text();
      console.log(result);
      alert('회원가입 성공!');
      window.location.href = '/main';
    } catch (error) {
      console.error('Error:', error);
      alert('회원가입 중 오류가 발생했습니다: ' + error.message);
    }
  };

  return (
    <div className="signup-background">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">회원가입</h2>

        {/* 사용자 이름 입력 필드 */}
        <div className="login-input-container">
          <label>사용자 이름</label>
          <input
            type="text"
            name="username"
            placeholder="아이디를 입력하세요"
            value={formData.username}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        {/* 이메일 입력 필드 */}
        <div className="login-input-container">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        {/* 비밀번호 입력 필드 */}
        <div className="login-input-container">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호를 입력하세요"
            value={formData.password}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        {/* 전화번호 입력 필드 */}
        <div className="login-input-container">
          <label>전화번호</label>
          <input
            type="text"
            name="phoneNum"
            placeholder="전화번호를 입력하세요"
            value={formData.phoneNum}
            onChange={handleChange}
            required
            className="signup-input"
          />
        </div>

        {/* 버튼 컨테이너 */}
        <div className="button-container">
          <button type="button" className="cancel-button" onClick={() => (window.location.href = '/')}>
            취소
          </button>
          <button type="submit" className="confirm-button">
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
