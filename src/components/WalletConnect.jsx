// src/components/WalletConnect.jsx
import React from 'react';
import usePolkadot from '../hooks/usePolkadot';

const WalletConnect = () => {
    const { accounts, connectAccount, selectedAccount } = usePolkadot();

    return (
        <div>
            {accounts.length === 0 ? (
                <button onClick={() => window.open('https://polkadot.js.org/extension/', '_blank')}>
                    Install Polkadot.js Extension
                </button>
            ) : (
                <div>
                    <h2>Connected Accounts</h2>
                    <select onChange={(e) => connectAccount(accounts[e.target.value])}>
                        <option value="">Select an account</option>
                        {accounts.map((account, index) => (
                            <option key={account.address} value={index}>
                                {account.meta.name} - {account.address}
                            </option>
                        ))}
                    </select>
                    {selectedAccount && (
                        <div>
                            <p>Selected Account: {selectedAccount.meta.name}</p>
                            <p>Address: {selectedAccount.address}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WalletConnect;