import { availableNetworks } from "../constants.ts";

export function cx(...args: unknown[]) {
  return args
    .flat()
    .filter((x) => typeof x === "string")
    .join(" ")
    .trim();
}

export const isAllowedNetwork = (chainId: string): boolean => {
  console.log("isAllowedNetwork", parseInt(chainId, 16));
  return availableNetworks.map((el) => el.chainId).includes(parseInt(chainId, 16).toString());
};
