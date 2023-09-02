import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();
const config: HardhatUserConfig = {
  networks: {
    zkevm: {
      url: "https://rpc.public.zkevm-test.net",
      accounts: [process.env.PRIVATE_KEY_MUMBAI!],
    },
    linea: {
      url: "https://rpc.goerli.linea.build",
      accounts: [process.env.PRIVATE_KEY_MUMBAI!],
    },
    taiko: {
      url: "https://rpc.test.taiko.xyz",
      accounts: [process.env.PRIVATE_KEY_MUMBAI!],
    },
  },
  solidity: "0.8.19",
};

export default config;
