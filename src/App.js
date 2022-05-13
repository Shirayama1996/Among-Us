import { useState, useEffect } from "react";
import red from "./images/red.png";
import green from "./images/green.png";
import blue from "./images/blue.png";
import orange from "./images/orange.png";
import yellow from "./images/yellow.png";
import blank from "./images/blank.png";
import ScoreBoard from "./components/ScoreBoard";
import Timer from "./components/Timer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();
const width = 8;
const candyColors = [blue, green, orange, red, yellow];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [squareBeingDragged, setSquareBeingDragged] = useState(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const [time, setTime] = useState(60);
  const [isEnd, setIsEnd] = useState(false);

  const moveIntoSquareBelow = () => {
    for (let i = 0; i < 65 - width; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }
      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  };

  const checkForColumnOfFour = () => {
    for (let i = 0; i < 40; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      if (
        columnOfFour.every(
          (item) => currentColorArrangement[item] === decidedColor
        ) &&
        !isBlank
      ) {
        setScoreDisplay((score) => score + 4);
        columnOfFour.forEach((item) => (currentColorArrangement[item] = blank));
        return true;
      }
    }
  };
  const checkForColumnOfThree = () => {
    for (let i = 0; i < 48; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;

      if (
        columnOfThree.every(
          (item) => currentColorArrangement[item] === decidedColor
        ) &&
        !isBlank
      ) {
        setScoreDisplay((score) => score + 3);
        columnOfThree.forEach(
          (item) => (currentColorArrangement[item] = blank)
        );
        return true;
      }
    }
  };

  const checkForRowOfThree = () => {
    for (let i = 0; i < 65; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      const isBlank = currentColorArrangement[i] === blank;

      if (notValid.includes(i)) continue;
      if (
        rowOfThree.every(
          (item) => currentColorArrangement[item] === decidedColor
        ) &&
        !isBlank
      ) {
        setScoreDisplay((score) => score + 3);
        rowOfThree.forEach((item) => (currentColorArrangement[item] = blank));
        return true;
      }
    }
  };

  const checkForRowOfFour = () => {
    for (let i = 0; i < 65; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      const isBlank = currentColorArrangement[i] === blank;

      if (notValid.includes(i)) continue;
      if (
        rowOfFour.every(
          (item) => currentColorArrangement[item] === decidedColor
        ) &&
        !isBlank
      ) {
        setScoreDisplay((score) => score + 4);
        rowOfFour.forEach((item) => (currentColorArrangement[item] = blank));
        return true;
      }
    }
  };

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };
  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfThree,
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArrangement,
  ]);

  useEffect(() => {
    if (time > 0 && scoreDisplay < 250) {
      const newTimer = setInterval(() => {
        let newTime = time - 1;
        setTime(newTime);
      }, 1000);
      return () => {
        clearInterval(newTimer);
      };
    } else if (time > 0 && scoreDisplay > 250) {
      toast.success("Congratulations", { autoClose: 3000 });
      setIsEnd(true);
    } else {
      toast.warning("Time's up, you failed", { autoClose: 3000 });
      setIsEnd(true);
    }
  }, [time]);

  const dragStart = (e) => {
    setSquareBeingDragged(e.target);
  };
  const dragDrop = (e) => {
    setSquareBeingReplaced(e.target);
  };
  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(
      squareBeingDragged.getAttribute("data-id")
    );
    const squareBeingReplacedId = parseInt(
      squareBeingReplaced.getAttribute("data-id")
    );

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
      squareBeingDraggedId - width,
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);
    if (!validMove) {
      return;
    }
    currentColorArrangement[squareBeingReplacedId] =
      squareBeingDragged.getAttribute("src");
    currentColorArrangement[squareBeingDraggedId] =
      squareBeingReplaced.getAttribute("src");
    const isAColumnOfFour = checkForColumnOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfFour = checkForRowOfFour();
    const isARowOfThree = checkForRowOfThree();
    if (
      squareBeingReplacedId &&
      validMove &&
      (isAColumnOfFour || isAColumnOfThree || isARowOfFour || isARowOfThree)
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] =
        squareBeingReplaced.getAttribute("src");
      currentColorArrangement[squareBeingDraggedId] =
        squareBeingDragged.getAttribute("src");
    }
  };

  return (
    <>
      <p>
        <i>
          Note: your challenge of this map is to reach the{" "}
          <b>
            <u>score of 250 </u>
          </b>
          in 60 sec
        </i>
      </p>
      <div className="app">
        <div className="game">
          {currentColorArrangement.map((candyColor, index) => {
            return (
              <img
                key={index}
                src={candyColor}
                alt={candyColor}
                data-id={index}
                draggable={true}
                onDragStart={dragStart}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={(e) => e.preventDefault()}
                onDrop={dragDrop}
                onDragEnd={dragEnd}
              />
            );
          })}
        </div>
      </div>
      <ScoreBoard score={scoreDisplay} endGame={isEnd} />
      <Timer time={time} endGame={isEnd} />
    </>
  );
};

export default App;
