import { signal } from "@preact/signals-react";

// metamask related
type Wallet = { accounts: string[]; chainId: string; balance: string };
export const wallet = signal<Wallet | undefined>(undefined);

export const title = signal("");
export const wantingDebtsCleared = signal(false);
