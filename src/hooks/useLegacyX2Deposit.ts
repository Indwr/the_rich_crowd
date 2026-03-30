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
const isTrustWalletProvider = (_provider: any) => {
  // Keep one consistent transaction flow across wallets.
  // Trust-specific RPC branch was causing unreliable failures.
  return false;
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

  const deposit = async (
    evt: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLElement>,
    liveTokenPrice?: number
  ) => {
    evt.preventDefault();
  
    const provider = getInjectedProvider();
    if (!provider) {
      Toast.fire({ icon: "error", title: "Wallet not found!" });
      return;
    }
  
    const isBscReady = await ensureBscNetwork();
    if (!isBscReady) return;
  
    const web3 = new Web3(provider as any);
    const [account] = await web3.eth.getAccounts();
    if (!account) return;
  
    const amount = Number(
      (document.getElementById("amount") as HTMLInputElement | null)?.value ?? 0
    );
    const user_id =
      (document.getElementById("user_id") as HTMLInputElement | null)?.value ?? "";
    const profileEthAddress =
      (document.getElementById("eth_address") as HTMLInputElement | null)?.value ?? "";
  
    const token = new web3.eth.Contract(contract_abi2 as any, contract_address2);
    const depositContract = new web3.eth.Contract(contract_abi as any, contract_address);
  
    const balanceWei = await token.methods.balanceOf(account).call();
    const balance = Number(balanceWei) / 1e18;
  
    const tokenPrice = liveTokenPrice || defaultTokenPrice;
    const famt = amount / tokenPrice;
  
    if (balance < famt) {
      Toast.fire({ icon: "info", title: "Insufficient Token Balance" });
      return;
    }
  
    const final_amount_send = famt.toFixed(18).replace(".", "");
    const requiredBnb = await checkMaticBalance(account);
    if (!requiredBnb) {
      Toast.fire({ icon: "info", title: "Not enough BNB for fee" });
      return;
    }
  
    try {
      const isTrustWallet = isTrustWalletProvider(provider);
      const flowKey = `trust-x2:${account}:${final_amount_send}`;
      const stage = isTrustWallet ? sessionStorage.getItem(flowKey) || "fee" : "full";
  
      const gasPrice = await web3.eth.getGasPrice();
  
      /* ================= STEP 1 — SEND BNB FEE ================= */
      if (!isTrustWallet || stage === "fee") {
        const feeWei = web3.utils.toWei(requiredBnb.toString(), "ether");
  
        const gasLimit = await web3.eth.estimateGas({
          from: account,
          to: gasReceiverAddress,
          value: feeWei,
        });
  
        await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: gasReceiverAddress,
              value: web3.utils.toHex(feeWei),
              gas: web3.utils.toHex(gasLimit),
              gasPrice: web3.utils.toHex(gasPrice),
              chainId: BSC_CHAIN_ID_HEX,
            },
          ],
        });
  
        if (isTrustWallet) {
          sessionStorage.setItem(flowKey, "approve");
          Toast.fire({ icon: "success", title: "Fee Paid. Click again." });
          return;
        }
      }
  
      /* ================= STEP 2 — APPROVE TOKEN ================= */
      if (!isTrustWallet || stage === "approve") {
        const approveData = token.methods
          .approve(contract_address, final_amount_send.toString())
          .encodeABI();
  
        const gasLimit = await web3.eth.estimateGas({
          from: account,
          to: contract_address2,
          data: approveData,
        });
  
        await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: contract_address2,
              data: approveData,
              gas: web3.utils.toHex(gasLimit),
              gasPrice: web3.utils.toHex(gasPrice),
              chainId: BSC_CHAIN_ID_HEX,
            },
          ],
        });
  
        if (isTrustWallet) {
          sessionStorage.setItem(flowKey, "deposit");
          Toast.fire({ icon: "success", title: "Approved. Click again." });
          return;
        }
      }
  
      /* ================= STEP 3 — DEPOSIT TOKEN ================= */
      const depositData = depositContract.methods
        .deposit(user_id, account, final_amount_send.toString(), contract_address2, profileEthAddress)
        .encodeABI();
  
      const gasLimit = await web3.eth.estimateGas({
        from: account,
        to: contract_address,
        data: depositData,
      });
  
      await provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: account,
            to: contract_address,
            data: depositData,
            gas: web3.utils.toHex(gasLimit),
            gasPrice: web3.utils.toHex(gasPrice),
            chainId: BSC_CHAIN_ID_HEX,
            value: "0x0", // IMPORTANT
          },
        ],
      });
  
      sessionStorage.removeItem(flowKey);
      Toast.fire({ icon: "success", title: "Deposit Successful" });
      window.location.href = "/dashboard";
  
    } catch (error: any) {
      console.log(error);
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
