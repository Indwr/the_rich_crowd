import { useCallback, useEffect, useMemo, useState } from 'react';
// import { BrowserProvider } from 'ethers';

type WalletState = {
  address: string | null;
  chainId: string | null;
  isConnecting: boolean;
  isSigning: boolean;
  error: string | null;
};

export function useEvmWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnecting: false,
    isSigning: false,
    error: null,
  });

  const hasProvider = useMemo(() => {
    return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
  }, []);

  const connect = useCallback(async () => {
    if (!hasProvider) {
      setState((s) => ({
        ...s,
        error: 'No EVM wallet found. Install MetaMask or a compatible wallet.',
      }));
      return null;
    }
    try {
      setState((s) => ({ ...s, isConnecting: true, error: null }));
      const eth = (window as any).ethereum as InjectedProvider;
      // const provider = new BrowserProvider(eth as any);

      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      const address = accounts[0] ?? null;

      const chainIdHex: string = await eth.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16).toString();

      setState((s) => ({ ...s, address, chainId, isConnecting: false, error: null }));
      return address;
    } catch (err: any) {
      setState((s) => ({
        ...s,
        isConnecting: false,
        error: err?.message ?? 'Failed to connect wallet.',
      }));
      return null;
    }
  }, [hasProvider]);

  const signMessage = useCallback(
    async (message: string) => {
      if (!hasProvider || !state.address) {
        setState((s) => ({
          ...s,
          error: 'Connect wallet before signing the message.',
        }));
        return null;
      }

      try {
        setState((s) => ({ ...s, isSigning: true, error: null }));
        const eth = (window as any).ethereum as InjectedProvider;
        const signature: string = await eth.request({
          method: 'personal_sign',
          params: [message, state.address],
        });

        setState((s) => ({ ...s, isSigning: false }));
        return signature;
      } catch (err: any) {
        setState((s) => ({
          ...s,
          isSigning: false,
          error: err?.message ?? 'Failed to sign wallet message.',
        }));
        return null;
      }
    },
    [hasProvider, state.address]
  );

  const disconnect = useCallback(() => {
    setState({ address: null, chainId: null, isConnecting: false, isSigning: false, error: null });
  }, []);

  useEffect(() => {
    if (!hasProvider) return;
    const eth = (window as any).ethereum as InjectedProvider;

    const handleAccountsChanged = (accounts: string[]) => {
      setState((s) => ({ ...s, address: accounts[0] ?? null }));
    };

    const handleChainChanged = (_chainId: string) => {
      setState((s) => ({ ...s, chainId: parseInt(_chainId, 16).toString() }));
    };
    const handleDisconnect = () => {
      setState({ address: null, chainId: null, isConnecting: false, isSigning: false, error: null });
    };

    eth.on?.('accountsChanged', handleAccountsChanged);
    eth.on?.('chainChanged', handleChainChanged);
    eth.on?.('disconnect', handleDisconnect);

    return () => {
      eth.removeListener?.('accountsChanged', handleAccountsChanged);
      eth.removeListener?.('chainChanged', handleChainChanged);
      eth.removeListener?.('disconnect', handleDisconnect);
    };
  }, [hasProvider]);

  return {
    ...state,
    hasProvider,
    connect,
    signMessage,
    disconnect,
  };
}

// types/InjectedProvider.ts
export interface InjectedProvider {
  request: (args: { method: string; params?: any[] | object }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}