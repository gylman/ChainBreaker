import { availableNetworks } from "../constants.ts";

export function cx(...args: unknown[]) {
  return args
    .flat()
    .filter((x) => typeof x === "string")
    .join(" ")
    .trim();
}

export const isAllowedNetwork = (chainId: string): boolean => {
  return availableNetworks.map((el) => el.chainId).includes(chainId);
};
