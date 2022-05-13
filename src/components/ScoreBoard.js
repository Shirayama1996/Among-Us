import { useState, useEffect } from "react";
const ScoreBoard = ({ score, endGame }) => {
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    if (endGame) {
      setFinalScore(score);
    }
  }, [endGame]);

  return (
    <div className="score-board">
      {!endGame && <h1>Your Score</h1>}
      {endGame && <h2>Your final score is: {finalScore}</h2>}
      {!endGame && <h2>{score}</h2>}
    </div>
  );
};

export default ScoreBoard;
