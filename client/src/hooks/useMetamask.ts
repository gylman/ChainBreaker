import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { wallet } from "../signals";
import { formatBalance } from "../utils/metamask";

export default function useMetamask() {
  const [providerExists, setProviderExists] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const refreshAccounts = (accounts: string[]) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        // if length 0, user is disconnected
        wallet.value = undefined;
      }
    };

    const refreshChain = (chainId: string) => {
      wallet.value = { accounts: [], balance: "0", ...wallet.peek(), chainId };
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setProviderExists(!!provider);

      if (provider) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  const updateWallet = async (accounts: string[]) => {
    const balance = formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      }),
    );
    console.log("balance", balance);

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    wallet.value = { accounts, balance, chainId };
  };

  const loadWallet = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);
  };

  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true, mustBeMetaMask: true });
      setProviderExists(!!provider);
    };
    getProvider();
  }, []);

  return { providerExists, loadWallet };
}
