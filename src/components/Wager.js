// src/components/Wager.js
import React, { useState } from 'react';

const Wager = ({
  account1,
  account2,
  setAccount1,
  setAccount2,
  setWager,
  onContinue
}) => {
  const [localWager, setLocalWager] = useState('');

  const handleWagerChange = (e) => {
    setLocalWager(e.target.value);
  };

  const handleSetWager = () => {
    if (!account1 || !account2) {
      alert('Both account fields must be filled out.');
      return;
    }
    setWager(localWager);
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
      <div style={{ marginBottom: '10px' }}>
        <label>
          Wager:
          <input
            type="text"
            value={localWager}
            onChange={handleWagerChange}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={handleSetWager}>
        Set Wager
      </button>
      <button onClick={onContinue} style={{ marginLeft: '10px' }}>
        Continue to Reaction Test
      </button>
    </div>
  );
};

export default Wager;