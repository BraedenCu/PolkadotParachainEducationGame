// src/App.js
import React from 'react';
import WalletConnect from './components/WalletConnect';
import Timer from './components/Timer';
import usePolkadot from './hooks/usePolkadot';

function App() {
    const { api, selectedAccount } = usePolkadot();

    return (
        <div>
            <h1>Study Buddy Duel</h1>
            <WalletConnect />
            {selectedAccount && api && <Timer api={api} account={selectedAccount} />}
        </div>
    );
}

export default App;