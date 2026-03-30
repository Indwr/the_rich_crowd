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
const getReadableError = (error: any) => {
  const message =
    error?.shortMessage ??
    error?.message ??
    error?.reason ??
    error?.data?.message ??
    error?.error?.message ??
    error?.cause?.message ??
    error?.originalError?.message;
  if (message) return String(message);
  if (typeof error?.code !== "undefined") return `Error code ${String(error.code)}`;
  try {
    const text = JSON.stringify(error);
    return text && text !== "{}" ? text : "Unexpected wallet error.";
  } catch (_error) {
    return "Unexpected wallet error.";
  }
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
const isTrustWalletProvider = (_provider: any) => {
  // Keep one consistent transaction flow across wallets.
  // Trust-specific RPC branch was causing unreliable failures.
  return false;
};
const waitForReceipt = async (web3: Web3, txHash: string, timeoutMs = 90000) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (receipt) return receipt;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("Timed out while waiting for fee transaction confirmation.");
};

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
    id: string,
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
    const account = accounts[0];
  
    if (!account) {
      void Toast.fire({
        icon: "info",
        title: "Dapp not connected, please check chain network!",
      });
      return;
    }
  
    setSelectedAccount(account);
    await fetchKsnBalance(account);
  
    const amount = Number(
      (document.getElementById("amount") as HTMLInputElement | null)?.value ?? 0
    );
    const user_id =
      (document.getElementById("user_id") as HTMLInputElement | null)?.value ?? "";
    const profileEthAddress =
      (document.getElementById("eth_address") as HTMLInputElement | null)?.value ?? "";
  
    if (!profileEthAddress) {
      void Toast.fire({
        icon: "info",
        title: "Profile wallet address missing. Please refresh and try again.",
      });
      return;
    }
  
    if (amount <= 0) {
      void Toast.fire({ icon: "info", title: "Invaild Amount!" });
      return;
    }
  
    const contract = new web3.eth.Contract(contract_abi2 as any, contract_address2, {
      from: account,
    });
  
    const balanceEther = await contract.methods.balanceOf(account).call();
    const balance = Number(balanceEther) / 1e18;
    const currency = String(await contract.methods.symbol().call());
  
    if (currency !== "KSN") {
      void Toast.fire({ icon: "info", title: "Invaild Crypto Currency!" });
      return;
    }
  
    const contract_deposit = new web3.eth.Contract(contract_abi as any, contract_address, {
      from: account,
    });
  
    const tokenPrice =
      Number.isFinite(liveTokenPrice) && Number(liveTokenPrice) > 0
        ? Number(liveTokenPrice)
        : defaultTokenPrice;
  
    const famt = amount / tokenPrice;
  
    if (balance < famt) {
      void Toast.fire({ icon: "info", title: "Insufficent Wallet Balance!" });
      return;
    }
  
    const final_amount_send = famt.toFixed(18).replace(".", "");
    if (Number(final_amount_send) <= 0) return;
  
    const requiredMatic = await checkMaticBalance(account);
    const gasBnb = Number(requiredMatic).toFixed(6);
    if (!requiredMatic) {
      void Toast.fire({
        icon: "info",
        title: `You need at least ${Number(requiredMatic).toFixed(4)} MATIC to proceed.`,
      });
      return;
    }
  
    let currentStage: "fee" | "approve" | "deposit" = "fee";
  
    try {
      const isTrustWallet = isTrustWalletProvider(provider);
      const trustFlowKey = `trust-x2:${account}:${final_amount_send}`;
      const trustStage = isTrustWallet
        ? sessionStorage.getItem(trustFlowKey) ?? "fee"
        : "full";
  
      const gasPrice = await web3.eth.getGasPrice();
  
      /* =====================================================
         STEP 1 — GAS FEE TRANSFER (FIXED FOR TRUST WALLET)
      ===================================================== */
      if (!isTrustWallet || trustStage === "fee") {
        currentStage = "fee";
  
        const gasTransferTx = {
          from: web3.utils.toChecksumAddress(account),
          to: web3.utils.toChecksumAddress(gasReceiverAddress),
          value: web3.utils.toWei(gasBnb, "ether"),
        };
  
        if (!isTrustWallet) {
          const gasLimit = await web3.eth.estimateGas(gasTransferTx);
          await web3.eth.sendTransaction({
            ...gasTransferTx,
            gas: Math.floor(Number(gasLimit) * 1.3),
            gasPrice: Math.floor(Number(gasPrice) * 1.2).toString(),
          });
        } else {
          const feeValueHex = web3.utils.toHex(gasTransferTx.value);
  
          const feeNonceHex = await provider.request({
            method: "eth_getTransactionCount",
            params: [gasTransferTx.from, "pending"],
          });
  
          const feeGasHex = await provider.request({
            method: "eth_estimateGas",
            params: [
              {
                from: gasTransferTx.from,
                to: gasTransferTx.to,
                value: feeValueHex,
              },
            ],
          });
  
          const gasPriceHex = web3.utils.toHex(gasPrice);
  
          const txHash = await provider.request({
            method: "eth_sendTransaction",
            params: [
              {
                from: gasTransferTx.from,
                to: gasTransferTx.to,
                value: feeValueHex,
                gas: feeGasHex,
                gasPrice: gasPriceHex,
                chainId: BSC_CHAIN_ID_HEX,
                nonce: feeNonceHex,
              },
            ],
          });
  
          await waitForReceipt(web3, txHash);
        }
  
        if (isTrustWallet) {
          sessionStorage.setItem(trustFlowKey, "approve");
          void Toast.fire({
            icon: "success",
            title: "Fee successful. Tap Approve again to continue.",
          });
          return;
        }
      }
  
      /* =====================================================
         STEP 2 — TOKEN APPROVE
      ===================================================== */
      if (!isTrustWallet || trustStage === "approve") {
        currentStage = "approve";
  
        if (!isTrustWallet) {
          await contract.methods
            .approve(contract_address, final_amount_send.toString())
            .send({ from: account });
        } else {
          const approveData = contract.methods
            .approve(contract_address, final_amount_send.toString())
            .encodeABI();
  
          const approveNonceHex = await provider.request({
            method: "eth_getTransactionCount",
            params: [account, "pending"],
          });
  
          const approveGasHex = await provider.request({
            method: "eth_estimateGas",
            params: [
              {
                from: account,
                to: contract_address2,
                data: approveData,
              },
            ],
          });
  
          const approveHash = await provider.request({
            method: "eth_sendTransaction",
            params: [
              {
                from: account,
                to: contract_address2,
                data: approveData,
                gas: approveGasHex,
                gasPrice: web3.utils.toHex(gasPrice),
                chainId: BSC_CHAIN_ID_HEX,
                nonce: approveNonceHex,
              },
            ],
          });
  
          await waitForReceipt(web3, approveHash);
        }
  
        if (isTrustWallet) {
          sessionStorage.setItem(trustFlowKey, "deposit");
          void Toast.fire({
            icon: "success",
            title: "Approval successful. Tap Approve again to complete deposit.",
          });
          return;
        }
      }
  
      /* =====================================================
         STEP 3 — DEPOSIT
      ===================================================== */
      currentStage = "deposit";
  
      if (!isTrustWallet) {
        await contract_deposit.methods
          .deposit(user_id, account, final_amount_send.toString(), contract_address2, profileEthAddress)
          .send({ from: account });
      } else {
        const depositData = contract_deposit.methods
          .deposit(user_id, account, final_amount_send.toString(), contract_address2, profileEthAddress)
          .encodeABI();
  
        const depositNonceHex = await provider.request({
          method: "eth_getTransactionCount",
          params: [account, "pending"],
        });
  
        const depositGasHex = await provider.request({
          method: "eth_estimateGas",
          params: [
            {
              from: account,
              to: contract_address,
              data: depositData,
            },
          ],
        });
  
        const depositHash = await provider.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: contract_address,
              data: depositData,
              gas: depositGasHex,
              gasPrice: web3.utils.toHex(gasPrice),
              chainId: BSC_CHAIN_ID_HEX,
              nonce: depositNonceHex,
            },
          ],
        });
  
        await waitForReceipt(web3, depositHash);
        sessionStorage.removeItem(trustFlowKey);
        window.location.href = "/dashboard";
      }
    } catch (error: any) {
      const readableError = getReadableError(error);
      void Toast.fire({
        icon: "info",
        title: `Wallet error (${currentStage}): ${readableError}`,
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
