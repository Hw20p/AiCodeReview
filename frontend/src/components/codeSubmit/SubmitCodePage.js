import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import './SubmitCodePage.css';

function SubmitCodePage() {
  const [language, setLanguage] = useState('java');
  const [sourceCode, setSourceCode] = useState('');
  const [title, setTitle] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [tipIndex, setTipIndex] = useState(0);  // 표시할 팁의 인덱스 관리

  // 로딩 중에 표시될 팁 목록
  const tips = [
    "Tip 1: 상단 카테고리바에 있는 순위 버튼을 클릭하면 누적 점수에 따른 전체 순위를 확인할 수 있습니다.",
    "Tip 2: 상단 로그아웃 버튼 왼쪽에 있는 사용자 이름을 클릭하면 개인 정보를 수정할 수 있습니다.",
    "Tip 3: CODEREVIEW 로고를 클릭하면 메인화면으로 이동합니다.",
    "Tip 4: 상단 카테고리바에 있는 코드 제출 버튼을 클릭한 후, 코드를 입력하여 체점을 받을 수 있습니다.",
    "Tip 5: 로그인을 하지 않으면, 업적을 볼 수 없고, 체점 기능을 사용할 수 없습니다."
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    // 팁 인덱스를 6초 간격으로 업데이트하여 다른 팁을 표시
    const tipTimer = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 6000); // 6초 간격

    return () => {
      clearInterval(tipTimer);      // 팁 변경 인터벌 정리
    };
  }, [tips.length]);

  const languageExtensions = {
    java: java(),
    python: python(),
    cpp: cpp(),
  };

  const handleSubmit = async () => {
    // 제목이나 소스 코드가 비어있으면 제출되지 않도록 처리
    if (!title.trim() || !sourceCode.trim()) {
      alert('제목과 소스 코드를 모두 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true); // 로딩 시작

    // x-www-form-urlencoded 형식으로 데이터 변환
    const formBody = new URLSearchParams({
      userId: userId.toString(),
      code: sourceCode,
      title,
    });

    try {
      const response = await fetch('http://localhost:8080/api/code/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`,  // Authorization 헤더 추가
        },
        body: formBody.toString(),
      });

      if (!response.ok) {
        throw new Error('제출 실패');
      }

      alert('코드가 성공적으로 제출되었습니다.');
      window.location.href = '/submitted-codes';
    } catch (error) {
      console.error('Error:', error);
      alert('제출 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };



  const handleListClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
    window.location.href = '/submitted-codes';
  };

  return (
    <div className="app-container">
      <div className={`scp-submit-code-page ${isLoading ? 'scp-blur' : ''}`}>
        <header className="scp-header">
          <h1 className="scp-title">코드 제출</h1>
        </header>

        <div className="scp-form-container">
          <div className="scp-form-group">
            <label htmlFor="title-input">제목</label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="scp-input"
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="scp-form-group">
            <label htmlFor="language-select">언어</label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="scp-select-input"
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <div className="scp-form-group">
            <label htmlFor="source-code">소스 코드</label>
            <CodeMirror
              value={sourceCode}
              extensions={[languageExtensions[language]]}
              onChange={(value) => setSourceCode(value)}
              height="600px"
              className="scp-code-input"
            />
          </div>

          <div className="scp-submit-button-container">
            <button className="scp-submit-button" onClick={handleListClick}>
              목록
            </button>
            <button className="scp-submit-button" onClick={handleSubmit}>
              제출
            </button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="scp-loading-overlay">
          <div className="scp-loading-spinner"></div>  {/* 로딩 애니메이션 위로 배치 */}
          <div className="scp-tip-container">
            <p>{tips[tipIndex]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubmitCodePage;
