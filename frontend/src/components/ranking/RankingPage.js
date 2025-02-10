import React, { useEffect, useState } from 'react';
import './RankingPage.css';

const RankingPage = () => {
  // 상태 변수 정의
  const [rankings, setRankings] = useState([]); // 랭킹 목록 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null);     // 오류 상태 관리

  // 컴포넌트가 마운트될 때 API 요청하여 랭킹 데이터를 가져옴
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/rankings');

        if (!response.ok) {
          throw new Error('네트워크 응답이 좋지 않습니다.');
        }

        const data = await response.json();
        // Total Score 기준으로 내림차순 정렬 후 Rank 설정
        const sortedData = data
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((item, index) => ({
            ...item,
            userRank: index + 1,         // 랭킹 순위 설정
            userId: String(item.userId), // 사용자 ID는 문자열로 변환
          }));

        setRankings(sortedData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // 점수에 따른 등급을 반환하는 함수
  const getRankLabel = (score) => {
    if (score > 10000) {
      return 'Diamond';
    } else if (score > 5000) {
      return 'Platinum';
    } else if (score > 2000) {
      return 'Gold';
    } else if (score > 1000) {
      return 'Silver';
    } else if (score > 100) {
      return 'Bronze';
    }
    return 'newbie';
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>;
  }

  return (
    <div className="app-container">
      <div className="ranking-page">
        {/* 설명문 추가 */}
        <div className="ranking-description">
          <h3>점수에 따른 등급</h3>
          <ul>
            <li>0: <span className="newbie">Newbie </span>
              || 100: <span className="Bronze">Bronze </span>
              || 1000: <span className="Silver">Silver </span>
              || 2000: <span className="Gold">Gold </span>
              || 5000: <span className="Platinum">Platinum </span>
              || 10000: <span className="Diamond">Diamond </span>
            </li>
          </ul>
        </div>
        {/* Ranking Table */}
        <div className="ranking-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User Id</th>
                <th>Total Score</th>
                <th>등급</th> {/* 등급 열 추가 */}
              </tr>
            </thead>
            <tbody>
              {rankings.map((ranking, index) => (
                <tr key={index}>
                  <td>{ranking.userRank}</td>
                  <td>{ranking.user.username}</td>
                  <td>{ranking.totalScore}</td>
                  <td className={getRankLabel(ranking.totalScore)}>{getRankLabel(ranking.totalScore)}</td> {/* 등급 표시 */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
