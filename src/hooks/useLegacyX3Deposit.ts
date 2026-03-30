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
    const selectedAccount = accounts[0];
    if (selectedAccount) {
      setSelectedAccount(selectedAccount);
      await fetchKsnBalance(selectedAccount);
      const amount = Number((document.getElementById("amount") as HTMLInputElement | null)?.value ?? 0);
      const user_id = (document.getElementById("user_id") as HTMLInputElement | null)?.value ?? "";
      const profileEthAddress =
        (document.getElementById("eth_address") as HTMLInputElement | null)?.value ?? "";

      if (!profileEthAddress) {
        void Toast.fire({
          icon: "info",
          title: "Profile wallet address missing. Please refresh and try again.",
        });
        return;
      }

      if (amount > 0) {
        if (!contract_abi2.length || !contract_address2) {
          void Toast.fire({
            icon: "info",
            title: "Token contract ABI/address missing.",
          });
          return;
        }

        const contract = new web3.eth.Contract(contract_abi2 as any, contract_address2, {
          from: selectedAccount,
        });
        if (!contract?.methods?.balanceOf || !contract?.methods?.symbol) {
          void Toast.fire({
            icon: "info",
            title: "Invalid token ABI. balanceOf/symbol not found.",
          });
          return;
        }
        const balanceEther = await contract.methods.balanceOf(selectedAccount).call();

        const balance = Number(balanceEther) / 1000000000000000000;
        const tokenPrice =
          Number.isFinite(liveTokenPrice) && Number(liveTokenPrice) > 0
            ? Number(liveTokenPrice)
            : defaultTokenPrice;
        const famt = amount / tokenPrice;

        const currency = String((await contract.methods.symbol().call()) as any);
        if (currency === "KSN") {
          if (balance >= famt) {
            if (!contract_abi.length || !contract_address) {
              void Toast.fire({
                icon: "info",
                title: "Deposit contract ABI/address missing.",
              });
              return;
            }
            const contract_deposit = new web3.eth.Contract(contract_abi as any, contract_address, {
              from: selectedAccount,
            });
            if (!contract_deposit?.methods?.deposit) {
              void Toast.fire({
                icon: "info",
                title: "Invalid deposit ABI. deposit not found.",
              });
              return;
            }

            const final_amount_send = famt.toFixed(18).replace(".", "");
            console.log("final_amount_send", final_amount_send);

            if (Number(final_amount_send) > 0) {
              const requiredMatic = await checkMaticBalance(selectedAccount);
              const gasBnb = Number(requiredMatic).toFixed(6);
              console.log("requiredMatic", requiredMatic);

              if (requiredMatic) {
                let currentStage: "fee" | "approve" | "deposit" = "fee";
                try {
                  const isTrustWallet = isTrustWalletProvider(provider);
                  const trustFlowKey = `trust-x3:${selectedAccount}:${final_amount_send}`;
                  const trustStage = isTrustWallet
                    ? sessionStorage.getItem(trustFlowKey) ?? "fee"
                    : "full";
                  const gasPrice =
                    !isTrustWallet || trustStage !== "fee"
                      ? await web3.eth.getGasPrice()
                      : "0";
                  const baseNonce = isTrustWallet
                    ? null
                    : Number(await web3.eth.getTransactionCount(selectedAccount, "pending"));
                  if (!isTrustWallet || trustStage === "fee") {
                    currentStage = "fee";
                    if (!isTrustWallet) {
                      void Swal.fire({
                        html: "<b>Transaction in progress...<br/>Please do not refresh or leave this page.</b>",
                        allowOutsideClick: false,
                        didOpen: () => {
                          Swal.showLoading();
                        },
                      });
                    }
                    const gasTransferTx: Record<string, any> = {
                      from: web3.utils.toChecksumAddress(selectedAccount),
                      to: web3.utils.toChecksumAddress(gasReceiverAddress),
                      value: web3.utils.toWei(gasBnb, "ether"),
                    };
                    if (!isTrustWallet) {
                      const gasLimit = await web3.eth.estimateGas({
                        from: selectedAccount,
                        to: gasReceiverAddress,
                        value: web3.utils.toWei(gasBnb, "ether"),
                      });
                      gasTransferTx.gas = Math.floor(Number(gasLimit) * 1.5);
                      gasTransferTx.gasPrice = Math.floor(Number(gasPrice) * 1.3).toString();
                      gasTransferTx.nonce = baseNonce;
                      await web3.eth.sendTransaction(gasTransferTx as any).then((receipt) => {
                        console.log("✅ Transaction Successful: ", receipt);
                      });
                    } else {
                      const feeValueHex = `0x${BigInt(String(gasTransferTx.value)).toString(16)}`;
                      const feeGasHex = "0x5208";
                      const feeNonceHex = String(
                        await provider.request({
                          method: "eth_getTransactionCount",
                          params: [gasTransferTx.from, "pending"],
                        })
                      );
                      const txHash = String(
                        await provider.request({
                          method: "eth_sendTransaction",
                          params: [
                            {
                              from: gasTransferTx.from,
                              to: gasTransferTx.to,
                              value: feeValueHex,
                              gas: feeGasHex,
                              nonce: feeNonceHex,
                            },
                          ],
                        })
                      );
                      await waitForReceipt(web3, txHash);
                    }
                    if (isTrustWallet) {
                      sessionStorage.setItem(trustFlowKey, "approve");
                      Swal.close();
                      void Toast.fire({
                        icon: "success",
                        title: "Fee successful. Tap Approve again to continue.",
                      });
                      return;
                    }
                  }

                  void Swal.fire({
                    html: "<b>Wait for KSN token approval in progress...<br/>Please do not refresh or leave this page.</b>",
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading();
                    },
                  });

                  const approveTx: Record<string, any> = {
                    from: selectedAccount,
                  };
                  if (!isTrustWallet || trustStage === "approve") {
                    currentStage = "approve";
                    if (!isTrustWallet) {
                      const approvalEstimateGas = await contract.methods
                        .approve(contract_address, final_amount_send.toString())
                        .estimateGas({ from: selectedAccount });
                      approveTx.gasPrice = Math.floor(Number(gasPrice) * 1.3).toString();
                      approveTx.gas = Math.floor(Number(approvalEstimateGas) * 1.2);
                      approveTx.nonce = Number(baseNonce) + 1;
                      await contract.methods
                        .approve(contract_address, final_amount_send.toString())
                        .send(approveTx as any);
                    } else {
                      const approveData = contract.methods
                        .approve(contract_address, final_amount_send.toString())
                        .encodeABI();
                      const approveGasPriceHex = `0x${BigInt(String(gasPrice)).toString(16)}`;
                      const approveNonceHex = String(
                        await provider.request({
                          method: "eth_getTransactionCount",
                          params: [selectedAccount, "pending"],
                        })
                      );
                      const approveGasHex = String(
                        await provider.request({
                          method: "eth_estimateGas",
                          params: [
                            {
                              from: selectedAccount,
                              to: contract_address2,
                              data: approveData,
                              value: "0x0",
                            },
                          ],
                        })
                      );
                      const approveHash = String(
                        await provider.request({
                          method: "eth_sendTransaction",
                          params: [
                            {
                              from: selectedAccount,
                              to: contract_address2,
                              data: approveData,
                              value: "0x0",
                              gas: approveGasHex,
                              gasPrice: approveGasPriceHex,
                              chainId: BSC_CHAIN_ID_HEX,
                              nonce: approveNonceHex,
                            },
                          ],
                        })
                      );
                      await waitForReceipt(web3, approveHash);
                    }
                    if (isTrustWallet) {
                      sessionStorage.setItem(trustFlowKey, "deposit");
                      Swal.close();
                      void Toast.fire({
                        icon: "success",
                        title: "Approval successful. Tap Approve again to complete deposit.",
                      });
                      return;
                    }
                  }

                  const depositTx: Record<string, any> = {
                    from: selectedAccount,
                  };
                  if (!isTrustWallet) {
                    const estimatedGas = await contract_deposit.methods
                      .deposit(
                        user_id,
                        selectedAccount,
                        final_amount_send.toString(),
                        contract_address2,
                        profileEthAddress
                      )
                      .estimateGas({ from: selectedAccount });
                    depositTx.gasPrice = Math.floor(Number(gasPrice) * 1.3).toString();
                    depositTx.gas = Math.floor(Number(estimatedGas) * 1.2);
                    depositTx.nonce = Number(baseNonce) + 2;
                  }
                  if (isTrustWallet && trustStage !== "deposit") {
                    Swal.close();
                    void Toast.fire({
                      icon: "info",
                      title: "Please complete previous step first.",
                    });
                    return;
                  }
                  if (isTrustWallet) {
                    currentStage = "deposit";
                    const depositData = contract_deposit.methods
                      .deposit(
                        user_id,
                        selectedAccount,
                        final_amount_send.toString(),
                        contract_address2,
                        profileEthAddress
                      )
                      .encodeABI();
                    const depositGasPriceHex = `0x${BigInt(String(gasPrice)).toString(16)}`;
                    const depositNonceHex = String(
                      await provider.request({
                        method: "eth_getTransactionCount",
                        params: [selectedAccount, "pending"],
                      })
                    );
                    const depositGasHex = String(
                      await provider.request({
                        method: "eth_estimateGas",
                        params: [
                          {
                            from: selectedAccount,
                            to: contract_address,
                            data: depositData,
                            value: "0x0",
                          },
                        ],
                      })
                    );
                    const depositHash = String(
                      await provider.request({
                        method: "eth_sendTransaction",
                        params: [
                          {
                            from: selectedAccount,
                            to: contract_address,
                            data: depositData,
                            value: "0x0",
                            gas: depositGasHex,
                            gasPrice: depositGasPriceHex,
                            chainId: BSC_CHAIN_ID_HEX,
                            nonce: depositNonceHex,
                          },
                        ],
                      })
                    );
                    const receipt = await waitForReceipt(web3, depositHash);
                    const status = (receipt as any)?.status;
                    if (status === false || status === "0x0" || status === 0 || status === 0n) {
                      Swal.close();
                      void Toast.fire({ icon: "info", title: "Transaction Failed" });
                      return;
                    }
                    sessionStorage.removeItem(trustFlowKey);
                    void id;
                    await Swal.fire({
                      html: "<b>Transaction successful.<br/>Redirecting to dashboard...</b>",
                      allowOutsideClick: false,
                      timer: 50000,
                      timerProgressBar: true,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });
                    window.location.href = "/dashboard";
                    return;
                  }

                  contract_deposit.methods
                    .deposit(
                      user_id,
                      selectedAccount,
                      final_amount_send.toString(),
                      contract_address2,
                      profileEthAddress
                    )
                    .send(depositTx as any)
                  .once("transactionHash", function (_hash: string) {
                    void Swal.fire({
                      html: "<b>Please ensure that you do not refresh the page or navigate away until the transaction is complete. Leaving the process prematurely could result in potential loss of funds. Thank you for your understanding.</b>",
                      timerProgressBar: true,
                      allowOutsideClick: false,
                      didOpen: () => {
                        Swal.showLoading();
                      },
                    });
                  })
                  .once("receipt", function (_receipt: any) {})
                  .on("confirmation", function (..._args: any[]) {})
                  .on("error", function (_error: any) {
                    Swal.close();
                    void Toast.fire({ icon: "info", title: "Transaction Failed by Binance" });
                  })
                  .then(async function (receipt: any) {
                    if (receipt) {
                      if (isTrustWallet) {
                        sessionStorage.removeItem(trustFlowKey);
                      }
                      void id;
                      await Swal.fire({
                        html: "<b>Transaction successful.<br/>Redirecting to dashboard...</b>",
                        allowOutsideClick: false,
                        timer: 50000,
                        timerProgressBar: true,
                        didOpen: () => {
                          Swal.showLoading();
                        },
                      });
                      window.location.href = "/dashboard";
                    } else {
                      Swal.close();
                      void Toast.fire({ icon: "info", title: "Transaction Failed" });
                    }
                  });
                } catch (error: any) {
                  Swal.close();
                  const readableError = getReadableError(error);
                  if (
                    String(readableError).toLowerCase().includes("cancel") ||
                    Number(error?.code) === 4001
                  ) {
                    void Toast.fire({
                      icon: "info",
                      title: `Wallet request cancelled (${currentStage}). Please approve in Trust Wallet popup.`,
                    });
                    return;
                  }
                  void Toast.fire({
                    icon: "info",
                    title: `Wallet error (${currentStage}): ${readableError}`,
                  });
                }
              } else {
                void Toast.fire({
                  icon: "info",
                  title: `You need at least ${Number(requiredMatic).toFixed(4)} MATIC to proceed.`,
                });
              }
            }
          } else {
            void Toast.fire({
              icon: "info",
              title: "Insufficent Wallet Balance!",
            });
          }
        } else {
          void Toast.fire({
            icon: "info",
            title: "Invaild Crypto Currency!",
          });
        }
      } else {
        void Toast.fire({
          icon: "info",
          title: "Invaild Amount!",
        });
      }
    } else {
      void Toast.fire({
        icon: "info",
        title: "Dapp not connected, please check chain network!",
      });
    }
  };

  return {
    selectedAccount,
    ksnBalance,
    connectWallet,
    depositX3,
  };
};
