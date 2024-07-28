import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import './index.css';

const App = () => {
  const [account1, setAccount1] = useState('');
  const [account2, setAccount2] = useState('');
  const [balance1, setBalance1] = useState(null);
  const [balance2, setBalance2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentGame, setCurrentGame] = useState(null);
  const [results, setResults] = useState([]);
  const [highScore, setHighScore] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [activePlayer, setActivePlayer] = useState(1);
  const [winnerMessage, setWinnerMessage] = useState('');

  useEffect(() => {
    if (timeLeft > 0 && currentGame) {
      const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      handleGameEnd();
    }
  }, [timeLeft, currentGame]);

  const startGame = () => {
    setCurrentGame('arithmetic');
    setTimeLeft(60);
    setScore1(0);
    setScore2(0);
    setActivePlayer(1);
    generateQuestion();
  };

  const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setQuestion(`${num1} + ${num2}`);
    setAnswer(num1 + num2);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (parseInt(e.target.answer.value) === answer) {
      if (activePlayer === 1) {
        setScore1(score1 + 1);
      } else {
        setScore2(score2 + 1);
      }
    }
    setActivePlayer(activePlayer === 1 ? 2 : 1);
    generateQuestion();
    e.target.answer.value = '';
  };

  const handleGameEnd = async () => {
    setResults([...results, { score1, score2 }]);
    setHighScore({
      ...highScore,
      arithmetic: Math.max(highScore.arithmetic || 0, score1, score2),
    });
    setCurrentGame(null);
    setTimeLeft(0);

    // Determine the winner and send the reward
    const winner = score1 > score2 ? account1 : account2;
    const rewardMessage = `Sent wallet ${winner} 1 polkadot`;
    setWinnerMessage(rewardMessage);

    try {
      const provider = new WsProvider('wss://rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });

      // Assuming you have a function to send rewards
      await sendReward(api, winner);
    } catch (err) {
      console.error('Failed to send reward:', err);
    }
  };

  const sendReward = async (api, winner) => {
    // Implement the logic to send a reward to the winner
    console.log(`Reward sent to ${winner}`);
  };

  const fetchBalances = async () => {
    if (!account1.trim() || !account2.trim()) {
      setError('Both account addresses are required.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const provider = new WsProvider('wss://rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });

      const { data: balanceData1 } = await api.query.system.account(account1);
      const { data: balanceData2 } = await api.query.system.account(account2);

      setBalance1(balanceData1.free.toHuman());
      setBalance2(balanceData2.free.toHuman());
    } catch (err) {
      setError('Failed to fetch balances. Please check the account addresses and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div style={{ padding: '20px' }}>
        <h1>Polkadot Account Balance Comparator</h1>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Account 1:
            <input
              type="text"
              value={account1}
              onChange={(e) => setAccount1(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Account 2:
            <input
              type="text"
              value={account2}
              onChange={(e) => setAccount2(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <button onClick={fetchBalances} disabled={loading}>
          {loading ? 'Loading...' : 'Compare Balances'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginTop: '20px' }}>
          {balance1 !== null && (
            <p>
              <strong>Account 1 Balance:</strong> {balance1}
            </p>
          )}
          {balance2 !== null && (
            <p>
              <strong>Account 2 Balance:</strong> {balance2}
            </p>
          )}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h1>Arithmetic Challenge</h1>
        {currentGame ? (
          <div>
            <h2>Time Left: {timeLeft} seconds</h2>
            <h3>Current Player: Player {activePlayer}</h3>
            <p>{question}</p>
            <form onSubmit={handleAnswerSubmit}>
              <input type="number" name="answer" autoFocus />
              <button type="submit">Submit Answer</button>
            </form>
            <button onClick={() => setCurrentGame(null)}>Back to Menu</button>
          </div>
        ) : (
          <div>
            <button onClick={startGame}>Start Arithmetic Challenge</button>
            <h2>High Scores</h2>
            <ul>
              {Object.entries(highScore).map(([game, score]) => (
                <li key={game}>
                  {game}: {score}
                </li>
              ))}
            </ul>
            <h2>Results</h2>
            <ul>
              {results.map((result, index) => (
                <li key={index}>
                  Player 1: {result.score1}, Player 2: {result.score2}
                </li>
              ))}
            </ul>
            {winnerMessage && <h3>{winnerMessage}</h3>}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;