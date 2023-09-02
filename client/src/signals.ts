import { signal } from "@preact/signals-react";
import type { ChainBreak } from "./abi/types";
import type { ethers } from "ethers";
import type { Tx } from "./types";

// metamask related
type Wallet = { accounts: string[]; chainId: string; balance: string };
export const wallet = signal<Wallet | undefined>(undefined);

export const title = signal("");
export const chainBreak = signal<ChainBreak | undefined>(undefined);
export const signer = signal<ethers.JsonRpcSigner | undefined>(undefined);
export const contacts = signal<
  {
    address: string;
    balance: number;
  }[]
>([]);
export const transactions = signal<Tx[]>([]);
