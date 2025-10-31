import { Client, AccountId, PrivateKey, ContractExecuteTransaction, ContractId } from "@hashgraph/sdk";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.HEDERA_OPERATOR_ID || !process.env.OPERATOR_KEY || !process.env.AGRO_CONTRACT_ID) {
  throw new Error("Missing required Hedera environment variables.");
}

export const hederaClient = Client.forTestnet().setOperator(
  AccountId.fromString(process.env.HEDERA_OPERATOR_ID),
  PrivateKey.fromString(process.env.OPERATOR_KEY)
);

export const AGRO_CONTRACT_ID = ContractId.fromString(process.env.AGRO_CONTRACT_ID);