export type Tx = {
  address: string;
  amount: bigint;
  isSpent: boolean; // === "red"
  description: string;
  createdAt: Date;
  status: "pendingFor1" | "pendingFor2" | "confirmed" | "rejected";
  isUser1: boolean;
  idx: number;
};
