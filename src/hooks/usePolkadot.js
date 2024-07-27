// src/hooks/usePolkadot.js
import { useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';

const usePolkadot = () => {
    const [api, setApi] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);

    useEffect(() => {
        const setup = async () => {
            const extensions = await web3Enable('study-buddy-duel');
            if (extensions.length === 0) {
                // No extension installed, or the user did not accept the authorization
                return;
            }

            const allAccounts = await web3Accounts();
            setAccounts(allAccounts);

            const provider = new WsProvider('wss://rococo-rpc.polkadot.io');
            const api = await ApiPromise.create({ provider });
            setApi(api);
        };

        setup();
    }, []);

    const connectAccount = (account) => {
        setSelectedAccount(account);
    };

    return { api, accounts, selectedAccount, connectAccount };
};

export default usePolkadot;