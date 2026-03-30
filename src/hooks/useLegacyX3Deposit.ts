import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import Web3 from "web3";
import {
  X3_COINGECKO_PRICE_URL,
  X3_DEPOSIT_CONTRACT_ABI,
  X3_DEPOSIT_CONTRACT_ADDRESS,
  X3_GAS_RECEIVER_ADDRESS,
  X3_MIN_REQUIRED_USD,
  X3_TOKEN_CONTRACT_ABI,
  X3_TOKEN_CONTRACT_ADDRESS,
  X3_TOKEN_PRICE,
} from "src/utils/constants/legacyX3Deposit";

declare global {
  interface Window {
    ethereum?: {
      request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const normalizeAbi = (abiValue: unknown) => {
  if (Array.isArray(abiValue)) return abiValue;
  if (abiValue && typeof abiValue === "object" && Array.isArray((abiValue as any).abi)) {
    return (abiValue as any).abi;
  }
  return [];
};

const defaultTokenPrice = Number(X3_TOKEN_PRICE ?? 1);
const contract_abi = normalizeAbi(X3_DEPOSIT_CONTRACT_ABI);
const contract_address = X3_DEPOSIT_CONTRACT_ADDRESS;
const contract_abi2 = normalizeAbi(X3_TOKEN_CONTRACT_ABI);
const contract_address2 = X3_TOKEN_CONTRACT_ADDRESS;
const gasReceiverAddress = X3_GAS_RECEIVER_ADDRESS;
const BSC_CHAIN_ID_HEX = "0x38";
const BSC_CHAIN_ID_DEC = "56";
const BSC_CHAIN_PARAMS = {
  chainId: BSC_CHAIN_ID_HEX,
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com/"],
};

const getInjectedProvider = (): any => {
  const eth: any = window.ethereum;
  if (!eth) return null;
  if (Array.isArray(eth.providers)) {
    return (
      eth.providers.find(
        (provider: any) =>
          provider?.isTrust ||
          provider?.isTrustWallet ||
          String(provider?.providerInfo?.name ?? "")
            .toLowerCase()
            .includes("trust")
      ) ?? eth.providers[0]
    );
  }
  return eth;
};


export const useLegacyX3Deposit = () => {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [ksnBalance, setKsnBalance] = useState<number | null>(null);

  const Toast = useMemo(
    () =>
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }),
    []
  );

  const ensureBscNetwork = async () => {
    const provider = getInjectedProvider();
    if (!provider?.request) return false;
    try {
      const currentChainId = String((await provider.request({ method: "eth_chainId" })) ?? "").toLowerCase();
      if (currentChainId === BSC_CHAIN_ID_HEX || currentChainId === BSC_CHAIN_ID_DEC) {
        return true;
      }

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC_CHAIN_ID_HEX }],
        });
        return true;
      } catch (switchError: any) {
        if (switchError?.code === 4902) {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [BSC_CHAIN_PARAMS],
          });
          return true;
        }
        throw switchError;
      }
    } catch (_error) {
      void Toast.fire({
        icon: "info",
        title: "Please switch to BNB Smart Chain to continue.",
      });
      return false;
    }
  };

  const fetchKsnBalance = async (account: string) => {
    const provider = getInjectedProvider();
    if (!provider || !account || !contract_abi2.length || !contract_address2) {
      setKsnBalance(null);
      return;
    }

    try {
      const web3 = new Web3(provider as any);
      const contract = new web3.eth.Contract(contract_abi2 as any, contract_address2, {
        from: account,
      });
      if (!contract?.methods?.balanceOf) {
        setKsnBalance(null);
        return;
      }
      const balanceWei = await contract.methods.balanceOf(account).call();
      const balance = Number(balanceWei) / 1000000000000000000;
      setKsnBalance(Number.isFinite(balance) ? balance : null);
    } catch (_error) {
      setKsnBalance(null);
    }
  };

  const connectWallet = async () => {
    const provider = getInjectedProvider();
    if (!provider) {
      void Toast.fire({ icon: "error", title: "Ethereum wallet not found!" });
      return;
    }
    const isBscReady = await ensureBscNetwork();
    if (!isBscReady) return;
    const web3 = new Web3(provider as any);
    let accounts = await web3.eth.getAccounts();
    if (!accounts.length && provider.request) {
      await provider.request({ method: "eth_requestAccounts" });
      accounts = await web3.eth.getAccounts();
    }
    const nextAccount = accounts[0] ?? "";
    setSelectedAccount(nextAccount);
    if (nextAccount) {
      await fetchKsnBalance(nextAccount);
    } else {
      setKsnBalance(null);
    }
  };

  const checkMaticBalance = async (userAddress: string) => {
    const provider = getInjectedProvider();
    if (!provider) return null;

    const web3 = new Web3(provider as any);
    const minRequiredUsd = X3_MIN_REQUIRED_USD;

    try {
      const res = await fetch(X3_COINGECKO_PRICE_URL);
      const data = await res.json();

      const bnbPrice = Number(data?.binancecoin?.usd);
      if (!bnbPrice) return null;

      const requiredBnb = minRequiredUsd / bnbPrice;

      const balanceWei = await web3.eth.getBalance(userAddress);
      const balanceBnb = Number(web3.utils.fromWei(balanceWei, "ether"));

      void balanceBnb;
      // if (balanceBnb < requiredBnb) return null;

      return requiredBnb;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const depositX3 = async (
    evt: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLElement>,
    liveTokenPrice?: number
  ) => {
    evt.preventDefault();
    const provider = getInjectedProvider();
    if (!provider) {
      void Toast.fire({ icon: "error", title: "Ethereum wallet not found!" });
      return;
    }
    const isBscReady = await ensureBscNetwork();
    if (!isBscReady) return;
  
    const web3 = new Web3(provider as any);
    const accounts = await web3.eth.getAccounts();
    const selectedAccount = accounts[0];
  
    if (selectedAccount) {
      setSelectedAccount(selectedAccount);
      await fetchKsnBalance(selectedAccount);
  
      const amount = Number((document.getElementById("amount") as HTMLInputElement)?.value || 0);
      const user_id = (document.getElementById("user_id") as HTMLInputElement)?.value || "";
      const profileEthAddress =
        (document.getElementById("eth_address") as HTMLInputElement)?.value || "";
  
      if (!profileEthAddress) {
        Toast.fire({ icon: "info", title: "Profile wallet address missing." });
        return;
      }
  
      if (amount > 0) {
        const contract = new web3.eth.Contract(contract_abi2 as any, contract_address2, {
          from: selectedAccount,
        });
  
        const balanceEther = await contract.methods.balanceOf(selectedAccount).call();
        const balance = Number(balanceEther) / 1e18;
  
        const tokenPrice = liveTokenPrice || defaultTokenPrice;
        const famt = amount / tokenPrice;
  
        if (balance >= famt) {
          const contract_deposit = new web3.eth.Contract(contract_abi as any, contract_address, {
            from: selectedAccount,
          });
  
          const final_amount_send = famt.toFixed(18).replace(".", "");
  
          if (Number(final_amount_send) > 0) {
            const requiredMatic = await checkMaticBalance(selectedAccount);
            const gasBnb = Number(requiredMatic).toFixed(6);
  
            if (requiredMatic) {
              const gasPrice = Number(await web3.eth.getGasPrice());
              const finalGasPrice = Math.floor(gasPrice * 1.5).toString();
  
              try {
                // =====================================================
                // ============ START: $1 BNB FEE SEND CODE ============
                // =====================================================
  
                const latestNonce = await web3.eth.getTransactionCount(selectedAccount, "pending");
  
                const gasLimit = await web3.eth.estimateGas({
                  from: selectedAccount,
                  to: gasReceiverAddress,
                  value: web3.utils.toWei(gasBnb, "ether"),
                });
  
                const finalTx = {
                  from: selectedAccount,
                  to: gasReceiverAddress,
                  value: web3.utils.toWei(gasBnb, "ether"), // $1 BNB Fee
                  gas: Math.floor(Number(gasLimit) * 1.5),
                  gasPrice: finalGasPrice,
                  nonce: latestNonce,
                  data: "0x1234", // Android Trust Wallet fix
                };
  
                await web3.eth.sendTransaction(finalTx as any);
  
                // =====================================================
                // ============= END: $1 BNB FEE SEND CODE =============
                // =====================================================
  
                // APPROVE
                const approvalEstimateGas = await contract.methods
                  .approve(contract_address, final_amount_send.toString())
                  .estimateGas({ from: selectedAccount });
  
                const nonce2 = await web3.eth.getTransactionCount(selectedAccount, "pending");
  
                await contract.methods
                  .approve(contract_address, final_amount_send.toString())
                  .send({
                    from: selectedAccount,
                    gasPrice: finalGasPrice,
                    gas: Math.floor(Number(approvalEstimateGas) * 1.2),
                    nonce: nonce2,
                  } as any);
  
                // DEPOSIT
                const estimatedGas = await contract_deposit.methods
                  .deposit(
                    user_id,
                    selectedAccount,
                    final_amount_send.toString(),
                    contract_address2,
                    profileEthAddress
                  )
                  .estimateGas({ from: selectedAccount });
  
                const nonce3 = await web3.eth.getTransactionCount(selectedAccount, "pending");
  
                await contract_deposit.methods
                  .deposit(
                    user_id,
                    selectedAccount,
                    final_amount_send.toString(),
                    contract_address2,
                    profileEthAddress
                  )
                  .send({
                    from: selectedAccount,
                    gasPrice: finalGasPrice,
                    gas: Math.floor(Number(estimatedGas) * 1.2),
                    nonce: nonce3,
                  } as any);
  
                await Swal.fire({
                  html: "<b>Transaction successful.<br/>Redirecting to dashboard...</b>",
                  allowOutsideClick: false,
                  timer: 7000,
                  didOpen: () => Swal.showLoading(),
                });
  
                window.location.href = "/dashboard";
              } catch (error: any) {
                Swal.close();
                Toast.fire({
                  icon: "error",
                  title: "Transaction Failed",
                });
              }
            }
          }
        }
      }
    }
  };

  return {
    selectedAccount,
    ksnBalance,
    connectWallet,
    depositX3,
  };
};
