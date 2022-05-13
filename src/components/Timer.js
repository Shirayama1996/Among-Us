import lose from "../images/lose.png";
import win from "../images/win.png";

const Timer = ({ time, endGame }) => {
  return (
    <div>
      {!endGame && (
        <>
          <span>Timer: {time}</span>
        </>
      )}
      {endGame && time === 0 && (
        <>
          <h4>Time's up</h4>
          <h1 style={{ color: "#D0342C" }}>LOSE</h1>
          <img src={lose} style={{ width: "40px" }} />
        </>
      )}
      {endGame && time > 0 && (
        <>
          <span>Timer: {time}</span>
          <h1 style={{ color: "#28a745" }}>WIN</h1>
          <img src={win} style={{ width: "40px" }} />
        </>
      )}
    </div>
  );
};

export default Timer;
