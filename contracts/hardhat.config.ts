import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import path from "path";

//dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {}, // Local testing
    hederaTestnet: {
      url: "https://testnet.hashio.io/api", // Public Hashio RPC
      accounts: [process.env.HEDERA_OPERATOR_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"], // Fallback if env var missing
      chainId: 296, // Hedera testnet
      gasPrice: 460000000000, // Low gas (Hedera uses HBAR)
    },
    hederaMainnet: {
      url: "https://mainnet.hashio.io/api",
      accounts: [process.env.HEDERA_OPERATOR_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000"],
      chainId: 295,
      gasPrice: 460000000000,
    },
  },
  etherscan: {
    apiKey: {
      hederaTestnet: "no-api-key-needed", // HashScan doesn't need API key
    },
  },
};

export default config;
