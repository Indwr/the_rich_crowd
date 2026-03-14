import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import Web3 from "web3";
import {
  X2_COINGECKO_PRICE_URL,
  X2_DEPOSIT_API_PATH,
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

const base_url = import.meta.env.VITE_API_URL ?? "/";
const tokenPrice = Number(X2_TOKEN_PRICE ?? 1);
const contract_abi = normalizeAbi(X2_DEPOSIT_CONTRACT_ABI);
const contract_address = X2_DEPOSIT_CONTRACT_ADDRESS;
const contract_abi2 = normalizeAbi(X2_TOKEN_CONTRACT_ABI);
const contract_address2 = X2_TOKEN_CONTRACT_ADDRESS;
const gasReceiverAddress = X2_GAS_RECEIVER_ADDRESS;

export const useLegacyX2Deposit = () => {
  const [selectedAccount, setSelectedAccount] = useState("");

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

  const connectWallet = async () => {
    if (!window.ethereum) {
      void Toast.fire({ icon: "error", title: "Ethereum wallet not found!" });
      return;
    }
    const web3 = new Web3(window.ethereum as any);
    let accounts = await web3.eth.getAccounts();
    if (!accounts.length && window.ethereum.request) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      accounts = await web3.eth.getAccounts();
    }
    setSelectedAccount(accounts[0] ?? "");
  };

  const checkMaticBalance = async (userAddress: string) => {
    if (!window.ethereum) return null;

    const web3 = new Web3(window.ethereum as any);
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

  const deposit = async (evt: React.MouseEvent<HTMLElement> | React.FormEvent<HTMLElement>, id: string) => {
    evt.preventDefault();
    if (!window.ethereum) {
      void Toast.fire({ icon: "error", title: "Ethereum wallet not found!" });
      return;
    }

    const web3 = new Web3(window.ethereum as any);

    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    if (account) {
      setSelectedAccount(account);
      const amount = Number((document.getElementById("amount") as HTMLInputElement | null)?.value ?? 0);
      const user_id = (document.getElementById("user_id") as HTMLInputElement | null)?.value ?? "";

      if (amount > 0) {
        if (!contract_abi2.length || !contract_address2) {
          void Toast.fire({
            icon: "info",
            title: "Token contract ABI/address missing.",
          });
          return;
        }

        const contract = new web3.eth.Contract(contract_abi2 as any, contract_address2, {
          from: account,
        });
        if (!contract?.methods?.balanceOf || !contract?.methods?.symbol) {
          void Toast.fire({
            icon: "info",
            title: "Invalid token ABI. balanceOf/symbol not found.",
          });
          return;
        }
        const balanceEther = await contract.methods.balanceOf(account).call();

        const balance = Number(balanceEther) / 1000000000000000000;
        console.log("balance", balance);

        const currency = String(await contract.methods.symbol().call() as any);
        if (currency === "KSN") {
          if (!contract_abi.length || !contract_address) {
            void Toast.fire({
              icon: "info",
              title: "Deposit contract ABI/address missing.",
            });
            return;
          }
          const contract_deposit = new web3.eth.Contract(contract_abi as any, contract_address, {
            from: account,
          });
          if (!contract_deposit?.methods?.depositX2Token) {
            void Toast.fire({
              icon: "info",
              title: "Invalid deposit ABI. depositX2Token not found.",
            });
            return;
          }
          const famt = amount / tokenPrice;
          if (balance >= famt) {
            const final_amount_send = famt.toFixed(18).replace(".", "");
            console.log("final_amount_send", final_amount_send);

            if (Number(final_amount_send) > 0) {
              const requiredMatic = await checkMaticBalance(account);
              console.log("requiredMatic", requiredMatic);
              const gasBnb = Number(requiredMatic).toFixed(6);
              console.log("gasBnb", gasBnb);

              if (requiredMatic) {
                const gasPrice = await web3.eth.getGasPrice();
                void Swal.fire({
                  html: "<b>Transaction in progress...<br/>Please do not refresh or leave this page.</b>",
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });
                const latestNonce = await web3.eth.getTransactionCount(account, "latest");

                const gasLimit = await web3.eth.estimateGas({
                  from: account,
                  to: gasReceiverAddress,
                  value: web3.utils.toWei(gasBnb, "ether"),
                });

                const txParams = {
                  from: account,
                  to: gasReceiverAddress,
                  value: web3.utils.toWei(gasBnb, "ether"),
                  gas: Math.floor(Number(gasLimit) * 1.5),
                  gasPrice: Math.floor(Number(gasPrice) * 1.3).toString(),
                  nonce: latestNonce,
                };

                const txData = web3.utils.toHex(JSON.stringify(txParams));

                const finalTx = {
                  from: account,
                  to: gasReceiverAddress,
                  value: web3.utils.toWei(gasBnb, "ether"),
                  gas: Math.floor(Number(gasLimit) * 1.5),
                  gasPrice: Math.floor(Number(gasPrice) * 1.3).toString(),
                  nonce: latestNonce,
                  data: txData,
                };
                await web3.eth.sendTransaction(finalTx as any).then((receipt) => {
                  Swal.close();
                  console.log("✅ Transaction Successful: ", receipt);
                });

                const approvalEstimateGas = await contract.methods
                  .approve(contract_address, final_amount_send.toString())
                  .estimateGas({ from: account });

                void Swal.fire({
                  html: "<b>Wait for KSN token approval in progress...<br/>Please do not refresh or leave this page.</b>",
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });

                const nonce2 = await web3.eth.getTransactionCount(account, "latest");

                await contract.methods
                  .approve(contract_address, final_amount_send.toString())
                  .send({
                    from: account,
                    gasPrice: Math.floor(Number(gasPrice) * 1.3).toString(),
                    gas: approvalEstimateGas,
                    nonce: nonce2,
                  } as any)
                  .then((_receipt: any) => {
                    Swal.close();
                  });

                const estimatedGas = await contract_deposit.methods
                  .depositX2Token(user_id, account, final_amount_send.toString(), contract_address2)
                  .estimateGas({ from: account });

                contract_deposit.methods
                  .depositX2Token(user_id, account, final_amount_send.toString(), contract_address2)
                  .send({
                    gasPrice: Math.floor(Number(gasPrice) * 1.3).toString(),
                    gas: estimatedGas,
                  } as any)
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
                    void Toast.fire({ icon: "info", title: "Transaction Failed by Binance" });
                  })
                  .then(async function (receipt: any) {
                    if (receipt) {
                      const element = document.getElementById(id) as HTMLFormElement | null;
                      if (!element) return;
                      const formData = new FormData(element);
                      formData.append("blockHash", receipt.blockHash);
                      formData.append("hash", receipt.transactionHash);
                      formData.append("eth_address", account);
                      formData.append("transaction", JSON.stringify(receipt));

                      const main_url = base_url + X2_DEPOSIT_API_PATH;
                      const response = await fetch(main_url, {
                        method: "POST",
                        headers: {
                          "X-Requested-With": "XMLHttpRequest",
                        },
                        body: formData,
                      });
                      const result = await response.json();
                      if (result.statusCode === 200) {
                        void Toast.fire({ icon: "success", title: result.message });
                      } else {
                        void Toast.fire({ icon: "info", title: result.message });
                      }
                    } else {
                      void Toast.fire({ icon: "info", title: "Transaction Failed" });
                    }
                  });
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
    connectWallet,
    deposit,
  };
};
