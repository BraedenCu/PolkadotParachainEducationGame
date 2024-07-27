// src/App.js

import React, { useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

const App = () => {
  const [account1, setAccount1] = useState('');
  const [account2, setAccount2] = useState('');
  const [balance1, setBalance1] = useState(null);
  const [balance2, setBalance2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
  );
};

export default App;