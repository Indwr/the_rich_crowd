import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import Web3 from "web3";
import {
  X2_COINGECKO_PRICE_URL,
  X2_DEPOSIT_CONTRACT_ABI,
  X2_DEPOSIT_CONTRACT_ADDRESS,
  X2_GAS_RECEIVER_ADDRESS,
  X2_MIN_REQUIRED_USD,
  X2_TOKEN_CONTRACT_ABI,
  X2_TOKEN_CONTRACT_ADDRESS,
  X2_TOKEN_PRICE,
} from "src/utils/constants/legacyX2Deposit";

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

const defaultTokenPrice = Number(X2_TOKEN_PRICE ?? 1);
const contract_abi = normalizeAbi(X2_DEPOSIT_CONTRACT_ABI);
const contract_address = X2_DEPOSIT_CONTRACT_ADDRESS;
const contract_abi2 = normalizeAbi(X2_TOKEN_CONTRACT_ABI);
const contract_address2 = X2_TOKEN_CONTRACT_ADDRESS;
const gasReceiverAddress = X2_GAS_RECEIVER_ADDRESS;
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
// const getReadableError = (error: any) => {
//   const message =
//     error?.shortMessage ??
//     error?.message ??
//     error?.reason ??
//     error?.data?.message ??
//     error?.error?.message ??
//     error?.cause?.message ??
//     error?.originalError?.message;
//   if (message) return String(message);
//   if (typeof error?.code !== "undefined") return `Error code ${String(error.code)}`;
//   try {
//     const text = JSON.stringify(error);
//     return text && text !== "{}" ? text : "Unexpected wallet error.";
//   } catch (_error) {
//     return "Unexpected wallet error.";
//   }
// };
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

// const waitForReceipt = async (web3: Web3, txHash: string, timeoutMs = 90000) => {
//   const startedAt = Date.now();
//   while (Date.now() - startedAt < timeoutMs) {
//     const receipt = await web3.eth.getTransactionReceipt(txHash);
//     if (receipt) return receipt;
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   }
//   throw new Error("Timed out while waiting for fee transaction confirmation.");
// };

export const useLegacyX2Deposit = () => {
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
    const minRequiredUsd = X2_MIN_REQUIRED_USD;

    try {
      const res = await fetch(X2_COINGECKO_PRICE_URL);
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
  const switchToBsc = async (): Promise<boolean> => {
    const provider = (window as any).ethereum;
    if (!provider) return false;
  
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x38" }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x38",
                chainName: "Binance Smart Chain",
                nativeCurrency: {
                  name: "BNB",
                  symbol: "BNB",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.ankr.com/bsc"],
                blockExplorerUrls: ["https://bscscan.com"],
              },
            ],
          });
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }
  };
  
  const deposit = async (
    evt: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLElement>,
    liveTokenPrice?: number
  ): Promise<void> => {
    evt.preventDefault();
  
    if (!(window as any).ethereum) {
      Toast.fire({ icon: "error", title: "Wallet not found!" });
      return;
    }
  
    const switched = await switchToBsc();
    if (!switched) {
      Toast.fire({ icon: "error", title: "Switch to BSC network!" });
      return;
    }
  
    const web3 = new Web3((window as any).ethereum);
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
  
    if (!account) {
      Toast.fire({ icon: "info", title: "Wallet not connected!" });
      return;
    }
  
    const amount = Number((document.getElementById("amount") as HTMLInputElement)?.value || 0);
    const user_id = (document.getElementById("user_id") as HTMLInputElement)?.value || "";
    const profileEthAddress =
      (document.getElementById("eth_address") as HTMLInputElement)?.value || "";
  
    if (!amount || amount <= 0) {
      Toast.fire({ icon: "info", title: "Invalid Amount!" });
      return;
    }
  
    try {
      const tokenContract = new web3.eth.Contract(contract_abi2 as any, contract_address2, {
        from: account,
      });
  
      const depositContract = new web3.eth.Contract(contract_abi as any, contract_address, {
        from: account,
      });
  
      const balanceWei = await tokenContract.methods.balanceOf(account).call();
      const balance = Number(balanceWei) / 1e18;
  
      const tokenPrice = liveTokenPrice || defaultTokenPrice;
      const tokenAmount = amount / tokenPrice;
  
      if (balance < tokenAmount) {
        Toast.fire({ icon: "info", title: "Insufficient Token Balance!" });
        return;
      }
  
      const finalAmount = web3.utils.toWei(tokenAmount.toString(), "ether");
  
      const requiredBnb = await checkMaticBalance(account);
      if (!requiredBnb) {
        Toast.fire({ icon: "info", title: "Not enough BNB!" });
        return;
      }
  
      const gasPrice = Number(await web3.eth.getGasPrice());
  
      Swal.fire({
        html: "<b>Processing transaction... Please wait.</b>",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
  
      /* STEP 1 — FEE */
      const nonce = await web3.eth.getTransactionCount(account, "pending");
  
      const gasLimit = await web3.eth.estimateGas({
        from: account,
        to: gasReceiverAddress,
        value: web3.utils.toWei(requiredBnb.toString(), "ether"),
      });
  
      await web3.eth.sendTransaction({
        from: account,
        to: gasReceiverAddress,
        value: web3.utils.toWei(requiredBnb.toString(), "ether"),
        gas: Math.floor(Number(gasLimit) * 1.2),
        gasPrice: Math.floor(gasPrice * 1.5).toString(),
        nonce: nonce,
      });
  
      /* STEP 2 — APPROVE */
      const approveGas = await tokenContract.methods
        .approve(contract_address, finalAmount)
        .estimateGas({ from: account });
  
      await tokenContract.methods.approve(contract_address, finalAmount).send({
        from: account,
        gas: Math.floor(Number(approveGas) * 1.2).toString(),
        gasPrice: Math.floor(gasPrice * 1.5).toString(),
      });
  
      // Wait for approve mining
      await new Promise((resolve) => setTimeout(resolve, 6000));
  
      /* STEP 3 — DEPOSIT */
      const depositGas = await depositContract.methods
        .deposit(user_id, account, finalAmount, contract_address2, profileEthAddress)
        .estimateGas({ from: account });
  
      await depositContract.methods
        .deposit(user_id, account, finalAmount, contract_address2, profileEthAddress)
        .send({
          from: account,
          gas: Math.floor(Number(depositGas) * 1.2).toString(),
          gasPrice: Math.floor(gasPrice * 1.5).toString(),
        });
  
      Swal.fire("Success", "Deposit successful!", "success").then(() => {
        window.location.href = "/dashboard";
      });
  
    } catch (error: any) {
      Swal.close();
      Toast.fire({
        icon: "error",
        title: error?.message || "Transaction Failed",
      });
    }
  };

  return {
    selectedAccount,
    ksnBalance,
    connectWallet,
    deposit,
  };
};
