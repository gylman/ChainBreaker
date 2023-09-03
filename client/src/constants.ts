export const metamaskExists = window.ethereum?.isMetaMask;
export const availableNetworks = [
  { chainId: "1442", networkName: "zkevm(polygon)", chainBreakAddress: import.meta.env.VITE_CHAINBREAK_ADDRESS_ZKEVM },
  { chainId: "59140", networkName: "Linea testnet", chainBreakAddress: import.meta.env.VITE_CHAINBREAK_ADDRESS_LINEA },
];
