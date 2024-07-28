// src/components/ReactionTime.js
import React, { useState, useEffect } from 'react';
import './ReactionTime.css';

const ReactionTime = ({ onGameEnd }) => {
  const [start, setStart] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const handleClick = () => {
      if (start) {
        const time = new Date().getTime() - startTime;
        setReactionTime(time);
        setStart(false);
        onGameEnd(time);
      } else if (waiting) {
        onGameEnd(null);
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [start, waiting, startTime, onGameEnd]);

  const startTest = () => {
    setWaiting(true);
    setReactionTime(null);
    setTimeout(() => {
      setStart(true);
      setWaiting(false);
      setStartTime(new Date().getTime());
    }, Math.random() * 3000 + 2000); // random delay
  };

  return (
    <div className="reaction-container">
      <h2>Reaction Time Test</h2>
      {waiting && <p>Wait for the green signal...</p>}
      {start ? (
        <div className="reaction-click">
          <p>Click</p>
        </div>
      ) : (
        <button onClick={startTest}>Start</button>
      )}
      {reactionTime && <p>Your reaction time is: {reactionTime} ms</p>}
    </div>
  );
};

export default ReactionTime;