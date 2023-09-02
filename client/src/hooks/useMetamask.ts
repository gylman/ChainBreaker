import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { chainBreak, contacts, signer, transactions, wallet } from "../signals";
import { formatBalance } from "../utils/metamask";
import { ChainBreak__factory } from "../abi/types";
import type { Tx } from "../types";
import { availableNetworks } from "../constants.ts";

export default function useMetamask() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | undefined>(undefined);

  useEffect(() => {
    const refreshAccounts = (accounts: string[]) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        wallet.value = undefined;
      }
    };

    const refreshChain = () => {
      updateWallet(wallet.value?.accounts || []);
    };

    const getProvider = async () => {
      chainBreak.value = undefined;
      const provider = await detectEthereumProvider({ silent: true, mustBeMetaMask: true });

      if (provider) {
        window.ethereum?.on("accountsChanged", refreshAccounts);
        window.ethereum?.on("chainChanged", refreshChain);
        window.ethereum?.on("chainChanged", updateWallet);
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider ?? undefined);
        signer.value = await provider.getSigner();
        const chainId = await window.ethereum
          .request({
            method: "eth_chainId",
          })
          .then((res: string) => parseInt(res, 16).toString());
        chainBreak.value = ChainBreak__factory.connect(
          availableNetworks.find(({ chainId: networkId }) => chainId === networkId)!.chainBreakAddress,
          provider,
        );
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

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    wallet.value = { accounts: accounts.map((address) => address.toLowerCase()), balance, chainId };
  };

  const loadWallet = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    updateWallet(accounts);
  };

  const myAddress = wallet.value?.accounts.at(0);
  const updateContacts = useCallback(() => {
    if (!chainBreak.value || !myAddress) return;

    console.log("Updating contacts");

    const chainBreakValue = chainBreak.value;

    const getUserContacts = async () => {
      const allUserChannels = await chainBreakValue.getAllUserChannels(myAddress);
      const transactionsArray: Tx[] = [];
      contacts.value = allUserChannels.map((view) => {
        const isUser1 = view.user1.toLowerCase() === myAddress;
        const counterpartAddress = (isUser1 ? view.user2 : view.user1).toLowerCase();
        const transactionsOfUser = view.channel.txs.map((tx, idx) => {
          const isSpent = tx.from1 === isUser1;
          console.log(new Date(Number(tx.createdAt) * 1000), "tx.from1", tx.from1, "isUser1", isUser1);
          return {
            address: counterpartAddress,
            amount: tx.amount,
            isSpent, // === "red"
            description: tx.description,
            createdAt: new Date(Number(tx.createdAt) * 1000),
            status: (["pendingFor2", "pendingFor1", "confirmed", "rejected"] as const)[Number(tx.status)],
            isUser1,
            idx,
          };
        });
        transactionsArray.push(...transactionsOfUser);

        return {
          address: counterpartAddress,
          balance: Number(isUser1 ? view.channel.balance1 : view.channel.balance2),
        };
      });

      transactions.value = transactionsArray.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    };
    getUserContacts();
  }, [chainBreak.value, myAddress]);

  useEffect(() => {
    const interval = setInterval(updateContacts, 10_000);
    updateContacts();

    return () => {
      clearInterval(interval);
    };
  }, [updateContacts]);

  return { provider, providerExists: !!provider, loadWallet, updateContacts, myAddress };
}
