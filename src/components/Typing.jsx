import React, { useState, useEffect, useRef } from "react";
import { generateWords, SECONDS } from "./constants";

export default function ShowWords() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [charIndex, setCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const inputText = useRef(null);

  // Timer Function
  const start = () => {
    if (status === "finished") {
      setWords(generateWords());
      setIncorrect(0);
      setCorrect(0);
      setCurrWordIndex(0);
    }
    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return SECONDS;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  };

  const handleKeyDown = ({ keyCode, key }) => {
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCharIndex(-1);
    } else if (keyCode === 8) {
      setCharIndex(charIndex - 1);
      setCurrChar("");
    } else {
      setCharIndex(charIndex + 1);
      setCurrChar(key);
    }
  };
  // Check if Words Match
  const checkMatch = () => {
    const compareWord = words[currWordIndex];
    const checkIfWordMatch = compareWord === currInput.trim();
    if (checkIfWordMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  };

  // Cursor character styling function
  function createCharClass(wordIdx, charIdx, char) {
    if (
      wordIdx === currWordIndex &&
      charIdx === charIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        let style = { backgroundColor: "cyan" };
        return style.backgroundColor;
      } else if (
        wordIdx === currWordIndex &&
        charIndex >= words[currWordIndex].length
      ) {
        let style = { backgroundColor: "red" };
        return style.backgroundColor;
      } else {
        let style = { backgroundColor: "red" };
        return style.backgroundColor;
      }
    } else {
      return "";
    }
  }

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      inputText.current.focus();
    }
  }, [status]);

  return (
    <div className="content">
      <div className="content-card">
        <div
          style={{
            textAlign: "center",
            margin: "20px auto",
            fontSize: "30px",
            fontWeight: 400,
            letterSpacing: "1px",
          }}
        >
          {`TIME: ${countDown}`}
        </div>
        <div
          className="content-input"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <input
            disabled={status !== "started"}
            ref={inputText}
            type="text"
            style={{ width: "50%", height: "40px", margin: "10px 0" }}
            onKeyDown={handleKeyDown}
            value={currInput}
            onChange={(e) => setCurrInput(e.target.value)}
          />
          <button
            onClick={start}
            type="button"
            className="count-down"
            style={{
              width: "50%",
              margin: "auto",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: "lightblue",
              color: "white",
              border: "none",
            }}
          >
            Start
          </button>
        </div>
        <div style={{
          textAlign: 'justify',
          margin: '10px 100px'
        }}>
        {status === "started" && (
          <div className="content-items">
            {words.map((word, i) => (
              <span key={i}>
                <span className="content-item">
                  {word.split("").map((char, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: `${createCharClass(i, idx, char)}`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span> </span>
              </span>
            ))}
          </div>
        )}
        </div>
      </div>
      {status === "finished" && (
        <div
          className="count-record"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
            fontSize: "25px",
            margin: "0 100px",
          }}
        >
          <div className="count-words">
            <p style={{ fontWeight: "bold" }}>Word per Minutes</p>
            {Math.floor(currWordIndex / (SECONDS / 60))}
            <span style={{ fontWeight: "bold", marginLeft: "5px" }}>WPM</span>
          </div>
          <div className="count-accuracy">
            <p style={{ fontWeight: "bold" }}>Accuracy</p>
           {`${Math.floor((correct / (correct + incorrect)) * 100)} %`}
          </div>
        </div>
      )}
    </div>
  );
}
