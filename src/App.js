// src/App.js

import React, { useState } from 'react';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import axios from 'axios';

const App = () => {
  const [account1, setAccount1] = useState('');
  const [account2, setAccount2] = useState('');
  const [balance1, setBalance1] = useState(null);
  const [balance2, setBalance2] = useState(null);
  const [transactions1, setTransactions1] = useState([]);
  const [transactions2, setTransactions2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [senderPrivateKey, setSenderPrivateKey] = useState('');

  const fetchBalancesAndTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new WsProvider('wss://rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });

      const [accountInfo1, accountInfo2] = await Promise.all([
        api.query.system.account(account1),
        api.query.system.account(account2),
      ]);

      setBalance1(accountInfo1.data.free.toHuman());
      setBalance2(accountInfo2.data.free.toHuman());

      const [transfers1, transfers2] = await Promise.all([
        fetchTransactions(account1),
        fetchTransactions(account2),
      ]);

      setTransactions1(transfers1);
      setTransactions2(transfers2);

    } catch (err) {
      setError('Failed to fetch balances or transactions. Please check the account addresses and try again.');
    }
    setLoading(false);
  };

  const fetchTransactions = async (account) => {
    const response = await axios.get(`https://polkadot.api.subscan.io/api/scan/transfers`, {
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({
        address: account,
        row: 10,
        page: 0,
      })
    });
    return response.data.data.transfers;
  };

  const sendTransaction = async (recipient) => {
    if (!senderPrivateKey) {
      setError('Sender private key is required');
      return;
    }
    try {
      const provider = new WsProvider('wss://rpc.polkadot.io');
      const api = await ApiPromise.create({ provider });

      const keyring = new Keyring({ type: 'sr25519' });
      const sender = keyring.addFromUri(senderPrivateKey);

      const transfer = api.tx.balances.transfer(recipient, 1000000000000); // 0.001 DOT in Planck (smallest unit)
      const hash = await transfer.signAndSend(sender);

      console.log('Transfer sent with hash', hash.toHex());
      setError('');
    } catch (err) {
      setError('Failed to send transaction. Please check the private key and recipient address.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Polkadot Account Balance and Transactions Comparator</h1>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Sender Private Key:
          <input
            type="text"
            value={senderPrivateKey}
            onChange={(e) => setSenderPrivateKey(e.target.value)}
            style={{ marginLeft: '10px', width: '400px' }}
          />
        </label>
      </div>
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
        <button onClick={() => sendTransaction(account1)} disabled={loading}>
          Send 0.001 DOT to Account 1
        </button>
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
        <button onClick={() => sendTransaction(account2)} disabled={loading}>
          Send 0.001 DOT to Account 2
        </button>
      </div>
      <button onClick={fetchBalancesAndTransactions} disabled={loading}>
        {loading ? 'Loading...' : 'Compare Balances and Transactions'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '20px' }}>
        {balance1 !== null && (
          <div>
            <p>
              <strong>Account 1 Balance:</strong> {balance1}
            </p>
            <h3>Recent Transactions for Account 1:</h3>
            <ul>
              {transactions1.map((tx, index) => (
                <li key={index}>
                  From: {tx.from}, To: {tx.to}, Amount: {tx.amount}, Date: {new Date(tx.block_timestamp * 1000).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
        {balance2 !== null && (
          <div>
            <p>
              <strong>Account 2 Balance:</strong> {balance2}
            </p>
            <h3>Recent Transactions for Account 2:</h3>
            <ul>
              {transactions2.map((tx, index) => (
                <li key={index}>
                  From: {tx.from}, To: {tx.to}, Amount: {tx.amount}, Date: {new Date(tx.block_timestamp * 1000).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;