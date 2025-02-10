import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { jwtDecode } from 'jwt-decode';
import './SubmittedCodes.css';

function SubmittedCodes() {
  const [submittedCodes, setSubmittedCodes] = useState([]); // 제출된 코드 목록
  const [selectedCode, setSelectedCode] = useState(null);   // 선택된 코드
  const [editedDetail, setEditedDetail] = useState('');     // 수정된 코드 내용
  const [language, setLanguage] = useState('java');         // 선택된 언어
  const [aiFeedback, setAiFeedback] = useState(null);       // AI 피드백
  const [isLoading, setIsLoading] = useState(false);        // 전체 로딩 상태 관리
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false); // AI 피드백 로딩 상태 관리
  const [tipIndex, setTipIndex] = useState(0);              // 로딩 중 팁 인덱스 관리

  // 코드미러 언어 설정
  const languageExtensions = {
    java: java(),
    python: python(),
    cpp: cpp(),
  };

  // 로딩 중 표시할 팁 목록
  const tips = [
    'Tip 1: 제출된 코드 목록에서 코드를 클릭하여 상세 내용을 확인하세요.',
    'Tip 2: 코드를 수정한 후 제출하여 새 점수를 확인할 수 있습니다.',
    'Tip 3: AI 피드백 분석을 통해 코드 개선 팁을 받아보세요.',
    'Tip 4: Pylint 분석 결과를 참고해 Python 코드 품질을 향상시키세요.',
    'Tip 5: 다른 언어의 코드를 선택하려면 언어 드롭다운을 변경하세요.',
  ];

  // 팁을 5초마다 변경하는 타이머 설정
  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000);

    // 컴포넌트가 언마운트될 때 타이머 정리
    return () => clearInterval(tipTimer);
  }, [tips.length]);

  // 제출된 코드 목록 로드
  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userIdFromToken = decodedToken.userId;

      if (userIdFromToken) {
        fetch(`http://localhost:8080/api/code/submissions?userId=${userIdFromToken}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) throw new Error('코드 제출 목록을 불러오는 데 실패했습니다.');
            return response.json();
          })
          .then((data) => setSubmittedCodes(data)) // 코드 목록 상태 업데이트
          .catch((error) => console.error('Error:', error))
          .finally(() => setIsLoading(false));
      } else {
        console.error('JWT 토큰에서 userId를 찾을 수 없습니다.');
        setIsLoading(false);
      }
    } else {
      console.error('로컬 스토리지에 토큰이 없습니다.');
      setIsLoading(false);
    }
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번 실행

  // 코드 선택 처리
  const handleCodeSelect = (code) => {
    setSelectedCode(code);
    setEditedDetail(code.revisedCode || code.initialCode);
    setLanguage(code.language || 'java');
    setAiFeedback(null);
  };

  // 수정된 코드 제출
  const resubmitCode = async () => {
    if (!selectedCode) {
      alert('수정할 코드를 선택해 주세요.');
      return;
    }

    const resubmissionData = new URLSearchParams();
    resubmissionData.append('submissionId', selectedCode.id);
    resubmissionData.append('revisedCode', editedDetail);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/code/revise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${token}`,
        },
        body: resubmissionData.toString(),
      });

      if (!response.ok) {
        throw new Error('수정된 코드 제출 실패');
      }

      const updatedCode = await response.json();
      setSelectedCode(updatedCode);
      alert('수정된 코드가 제출되었습니다.');
    } catch (error) {
      console.error('Error:', error);
      alert('코드 제출 중 오류가 발생했습니다.');
    }
  };

  // AI 피드백 분석 요청
  const analyzeFeedback = async () => {
    if (!selectedCode) {
      alert('피드백을 분석할 코드를 선택해 주세요.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    // revisedCode가 없으면 initialCode를 사용
    const codeToAnalyze = selectedCode.revisedCode || selectedCode.initialCode;

    if (!codeToAnalyze) {
      alert('분석할 코드가 없습니다.');
      return;
    }

    // AI 피드백 로딩 시작
    setIsLoadingFeedback(true);
    try {
      const response = await fetch('http://localhost:8080/api/code/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: codeToAnalyze }),
      });

      if (!response.ok) {
        throw new Error('AI 피드백 요청 실패');
      }

      const data = await response.json();
      setAiFeedback(data.response); // AI 피드백 결과 저장
    } catch (error) {
      console.error('AI 피드백 분석 중 오류 발생:', error);
      alert('AI 피드백 요청 중 문제가 발생했습니다.');
    } finally {
      setIsLoadingFeedback(false); // 로딩 상태 종료
    }
  };


  // Pylint 결과 포맷팅
  const formatPylintOutput = (output) => {
    if (!output) return 'Pylint 결과가 없습니다.';
    const cleanedOutput = output
      .split('\n')
      .filter(
        (line) =>
          !line.includes('DeprecationWarning') &&
          !line.startsWith('************* Module') &&
          !line.includes('(pylint_stdout, _) = lint.py_run(file_path, return_std=True)')
      );

    const formattedOutput = cleanedOutput
      .map((line) => {
        let updatedLine = line.replace(/.*\\Temp\\[^\\]+\.py:(\d+):/, 'py:$1:');
        updatedLine = updatedLine.replace(/(convention|warning|error) \(([^,]+), ([^)]+)\)/, '($2, $3)');
        const match = updatedLine.match(/^(py:\d+: \([^)]*\))\s*(.*)/);
        if (match) {
          const message = match[1];
          const description = match[2];
          return `<span class="sc-highlight">${message}</span>\n<span class="sc-bold">${description}</span>\n`;
        } else {
          return `<span class="sc-bold">${updatedLine}</span>`;
        }
      })
      .join('\n\n');

    return formattedOutput.trim();
  };

  return (
    <div className="sc-submitted-codes-page">
      <div className="sc-code-list">
        <h3>제출 코드 목록</h3>
        <ul>
          {submittedCodes.map((code, index) => (
            <li key={index} onClick={() => handleCodeSelect(code)}>
              {code.title || `제출 코드 ${index + 1}`}
            </li>
          ))}
        </ul>
      </div>

      <div className="sc-code-details">
        {selectedCode ? (
          <>
            <h4>{selectedCode.title}</h4>
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

            <CodeMirror
              value={editedDetail}
              extensions={[languageExtensions[language] || java()]}
              onChange={(value) => setEditedDetail(value)}
              height="400px"
            />

            <div className="sc-feedback-section">
              {aiFeedback && (
                <div className="ai-feedback-section">
                  <h5>AI 피드백 결과:</h5>
                  <pre>{aiFeedback}</pre>
                </div>
              )}
            </div>

            <div className="sc-feedback-section">
              <h5>Pylint 결과: </h5>
              <pre
                dangerouslySetInnerHTML={{
                  __html: selectedCode.revisedPylintOutput
                    ? formatPylintOutput(selectedCode.revisedPylintOutput)
                    : formatPylintOutput(selectedCode.pylintOutput),
                }}
              />
            </div>

            {isLoadingFeedback && (
              <div className="sc-loading-overlay">
                <div className="sc-loading-spinner"></div>
                <p className="sc-loading-tip">{tips[tipIndex]}</p>
              </div>
            )}
            <div className={`sc-content ${isLoading ? 'sc-blur' : ''}`}></div>

            <p>초기 점수: {selectedCode.initialScore}</p>
            <p>수정 후 점수: {selectedCode.revisedScore}</p>

            <button onClick={resubmitCode} className="sc-resubmit-button">
              수정된 코드 제출
            </button>
            <button onClick={analyzeFeedback} className="sc-analyze-feedback-button">
              AI 피드백 분석
            </button>
          </>
        ) : (
          <p>코드를 선택해 주세요.</p>
        )}
      </div>
    </div>
  );
}

export default SubmittedCodes;
