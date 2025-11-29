import React from 'react';
import { CardanoWallet, useWallet } from '@meshsdk/react';

export function WalletConnect() {
    const { connected, wallet } = useWallet();
    const [address, setAddress] = React.useState<string>('');

    React.useEffect(() => {
        if (connected && wallet) {
            wallet.getChangeAddress().then(setAddress);
        }
    }, [connected, wallet]);

    return (
        <div className="flex items-center gap-2">
            <CardanoWallet />
        </div>
    );
}
