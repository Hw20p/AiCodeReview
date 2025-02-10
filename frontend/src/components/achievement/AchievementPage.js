import React, { useEffect, useState } from 'react';
import './AchievementPage.css';
import { jwtDecode } from 'jwt-decode';

const AchievementPage = () => {
  // 상태 변수 설정
  const [achievements, setAchievements] = useState([]); // 업적 데이터 저장
  const [loading, setLoading] = useState(true);         // 로딩 상태
  const [error, setError] = useState(null);             // 오류 메시지
  const [userId, setUserId] = useState(null);           // 사용자 ID

  // JWT 토큰에서 사용자 ID 추출
  useEffect(() => {

    const token = localStorage.getItem('token');  // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      const decodedToken = jwtDecode(token);      // 토큰 디코딩
      setUserId(decodedToken.userId);             // 디코딩된 토큰에서 사용자 ID 설정
    }
  }, []);

  // 사용자 ID가 있을 때 업적 데이터를 가져오는 함수
  useEffect(() => {
    const fetchAchievements = async () => {
      // 사용자 ID가 없으면 종료
      if (!userId) return;

      const token = localStorage.getItem('token');
      try {
        // 사용자 ID를 기반으로 업적 정보를 서버에서 가져오기
        const response = await fetch(`http://localhost:8080/api/achievements/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', // 요청 타입
            'Authorization': `Bearer ${token}`, // JWT를 Authorization 헤더에 포함
          },
        });
        if (!response.ok) {
          // 응답이 성공적이지 않으면 오류 처리
          throw new Error('업적을 가져오는 데 실패했습니다.');
        }
        // 응답 데이터를 JSON으로 변환
        const data = await response.json();
        setAchievements(data);    // 업적 상태 업데이트
      } catch (error) {
        setError(error.message);  // 오류 발생 시 오류 메시지 설정
      } finally {
        setLoading(false);        // 로딩이 끝났으므로 로딩 상태 false로 설정
      }
    };
    fetchAchievements(); // 업적 가져오기 호출
  }, [userId]);

  if (loading) {
    return <div>로딩 중...</div>;    // 로딩 상태일 때 표시되는 텍스트
  }

  if (error) {
    return <div>오류: {error}</div>; // 오류 처리
  }

  return (
    <div className="app-container">
      <div className="achievement-page"> {/* 랭킹 페이지 스타일 클래스 적용 */}
        <div className="achievement-description"> {/* 업적 설명 섹션 */}
          <h3>사용자 업적 리스트</h3>
          <ul>
            <li>업적을 달성하여 보상을 받으세요!</li>
            <li>각 업적에 대한 설명과 달성 날짜를 확인하세요.</li>
          </ul>
        </div>
        {/* 업적 테이블 */}
        <div className="achievement-table"> {/* 랭킹 테이블 스타일 클래스 적용 */}
          <table>
            <thead>
              <tr>
                <th>업적 이름</th>
                <th>업적 설명</th>
                <th>달성 날짜</th>
              </tr>
            </thead>
            <tbody>
              {achievements.map((userAchievement) => (
                <tr key={userAchievement.id}>
                  <td style={{ fontWeight: 'bold' }}>
                    {userAchievement.achievement.achievementName}
                  </td>
                  <td>{userAchievement.achievement.achievementDesc}</td>
                  <td>{userAchievement.dateAchieved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AchievementPage;
