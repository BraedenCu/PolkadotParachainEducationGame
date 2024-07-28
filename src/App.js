// src/App.js

import React, { useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import ReactionTime from './components/ReactionTime';
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

  const handleGameEnd = (result) => {
    if (result !== null) {
      setResults([...results, { game: 'reactionTime', result }]);
    }
    setHighScore({ ...highScore, reactionTime: Math.max(highScore.reactionTime || 0, result) });
    setCurrentGame(null);
  };

  const fetchBalances = async () => {
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
        <h1>Human Benchmark Test</h1>
        {currentGame ? (
          <ReactionTime onGameEnd={handleGameEnd} />
        ) : (
          <div>
            <button onClick={() => setCurrentGame('reactionTime')}>Reaction Time</button>
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
                  {result.game}: {result.result} ms
                </li>
              ))}
            </ul>
          </div>
        )}
        {currentGame && <button onClick={() => setCurrentGame(null)}>Back to Menu</button>}
      </div>
    </div>
  );
};

export default App;