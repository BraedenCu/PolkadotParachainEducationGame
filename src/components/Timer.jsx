// src/components/Timer.jsx
import React, { useState } from 'react';

const Timer = ({ api, account }) => {
    const [startTime, setStartTime] = useState(null);
    const [duration, setDuration] = useState(0);

    const startStudy = async () => {
        setStartTime(Date.now());
        // Logic to store start time on the blockchain
        await api.tx.studyBuddy.startStudy(account.address).signAndSend(account);
    };

    const endStudy = async () => {
        const endTime = Date.now();
        const studyDuration = (endTime - startTime) / 1000; // in seconds
        setDuration(studyDuration);
        // Logic to store end time and calculate duration on the blockchain
        await api.tx.studyBuddy.endStudy(account.address).signAndSend(account);
    };

    return (
        <div>
            <button onClick={startStudy}>Start Study</button>
            <button onClick={endStudy}>End Study</button>
            <p>Study Duration: {duration} seconds</p>
        </div>
    );
};

export default Timer;