import React, { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import './index.css';
import flags from './flags.json'; // Assume this JSON file contains { "countryName": "flagImageURL" } pairs

const App = () => {
  const [account1, setAccount1] = useState('');
  const [account2, setAccount2] = useState('');
  const [balance1, setBalance1] = useState(null);
  const [balance2, setBalance2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentGame, setCurrentGame] = useState(null);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [activePlayer, setActivePlayer] = useState(1);
  const [results, setResults] = useState([]);
  const [highScore, setHighScore] = useState({});
  const [winnerMessage, setWinnerMessage] = useState('');
  const [wager, setWager] = useState(1.1);

  useEffect(() => {
    if (timeLeft > 0 && currentGame) {
      const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      handleGameEnd();
    }
  }, [timeLeft, currentGame]);

  const startGame = () => {
    setCurrentGame('countryGuessing');
    setTimeLeft(20);
    setScore1(0);
    setScore2(0);
    setActivePlayer(1);
    generateQuestion();
  };

  const generateQuestion = () => {
    const countryNames = Object.keys(flags);
    const randomCountry = countryNames[Math.floor(Math.random() * countryNames.length)];
    setQuestion(randomCountry);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (answer.toLowerCase() === question.toLowerCase()) {
      if (activePlayer === 1) {
        setScore1(score1 + 1);
      } else {
        setScore2(score2 + 1);
      }
    }
    setActivePlayer(activePlayer === 1 ? 2 : 1);
    generateQuestion();
    setAnswer('');
  };

  const handleGameEnd = async () => {
    setResults([...results, { score1, score2 }]);
    setHighScore({
      ...highScore,
      countryGuessing: Math.max(highScore.countryGuessing || 0, score1, score2),
    });
    setCurrentGame(null);
    setTimeLeft(0);

    let winner;
    let loser;
    if (score1 > score2) {
      winner = account1;
      loser = account2;
      setWinnerMessage(`${account1} has been sent ${wager} DOT from ${account2}`);
    } else if (score2 > score1) {
      winner = account2;
      loser = account1;
      setWinnerMessage(`${account2} has been sent ${wager} DOT from ${account1}`);
    } else {
      setWinnerMessage(`It's a tie! No one wins.`);
      return;
    }

    try {
      const provider = new WsProvider('wss://rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });
      await sendReward(api, winner, loser);
    } catch (err) {
      console.error('Failed to send reward:', err);
      setError('Failed to send reward.');
    }
  };

  const sendReward = async (api, winner, loser) => {
    // Implement the logic to send a reward of the specified wager DOT from the loser to the winner
    console.log(`${wager} DOT sent from ${loser} to ${winner}`);
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

      setBalance1((balanceData1.free.toNumber() / 10000000000).toFixed(4));
      setBalance2((balanceData2.free.toNumber() / 10000000000).toFixed(4));
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
              <strong>Account 1 Balance:</strong> {balance1} DOT
            </p>
          )}
          {balance2 !== null && (
            <p>
              <strong>Account 2 Balance:</strong> {balance2} DOT
            </p>
          )}
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <h1>Country Guessing Game</h1>
        {currentGame ? (
          <div>
            <h2>Time Left: {timeLeft} seconds</h2>
            <h3>Current Player: Player {activePlayer}</h3>
            <img src={flags[question]} alt="country flag" style={{ width: '200px', height: 'auto' }} />
            <form onSubmit={handleAnswerSubmit}>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                autoFocus
              />
              <button type="submit">Submit Answer</button>
            </form>
          </div>
        ) : (
          <div>
            <label>
              Wager (DOT):
              <input
                type="number"
                value={wager}
                onChange={(e) => setWager(parseFloat(e.target.value))}
                style={{ marginLeft: '10px' }}
              />
            </label>
            <button onClick={startGame}>Start Country Guessing Game</button>

            <h2>Results</h2>
            <div>
              Player 1: {score1}
            </div>
            <div>
              Player 2: {score2}
            </div>
            {winnerMessage && <div className="result-box">{winnerMessage}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;