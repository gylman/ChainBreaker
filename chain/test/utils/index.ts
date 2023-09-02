import { ethers, toNumber } from "ethers";

export const getFirstUserAddress = (addresses: Array<string>) => {
  return addresses.sort()[0];
};
