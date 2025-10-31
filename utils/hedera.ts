import { Client, PrivateKey, AccountId, TransferTransaction, Hbar, ContractCallQuery, ContractExecuteTransaction, ContractFunctionParameters } from "@hashgraph/sdk";

export type HederaNetwork = "testnet" | "mainnet";
export type HederaConnection = {
	client: Client;
	accountId: string;
};

export type HederaTransfer = {
	to: string;
	amountTinybar: string;
};

const STORAGE_KEY = "hedera_encrypted_key_v1";

export async function connectHedera(network: HederaNetwork = "testnet", accountId: string, privateKey: string): Promise<HederaConnection> {
	const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
	client.setOperator(AccountId.fromString(accountId), PrivateKey.fromString(privateKey));
	return { client, accountId };
}

export async function signAndTransfer(
	conn: HederaConnection,
	transfers: HederaTransfer[]
): Promise<{ txId: string }> {
	const tx = new TransferTransaction();
	for (const t of transfers) {
		tx.addHbarTransfer(conn.accountId, Hbar.fromTinybars(-parseInt(t.amountTinybar)));
		tx.addHbarTransfer(t.to, Hbar.fromTinybars(parseInt(t.amountTinybar)));
	}
	const response = await tx.execute(conn.client);
	const receipt = await response.getReceipt(conn.client);
	return { txId: response.transactionId.toString() };
}

// Secure key cache
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
	const pwKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "PBKDF2" }, false, ["deriveKey"]);
	return crypto.subtle.deriveKey(
		{ name: "PBKDF2", salt: new Uint8Array(salt), iterations: 100000, hash: "SHA-256" },
		pwKey,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"]
	);
}

export async function cachePrivateKeyEncrypted(privateKey: string, password: string): Promise<void> {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const salt = crypto.getRandomValues(new Uint8Array(16));
	const key = await deriveKey(password, salt);
	const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(privateKey));
	const payload = {
		iv: Array.from(iv),
		salt: Array.from(salt),
		ciphertext: Array.from(new Uint8Array(ciphertext)),
	};
	if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function loadPrivateKeyDecrypted(password: string): Promise<string | null> {
	if (typeof window === "undefined") return null;
	const raw = window.localStorage.getItem(STORAGE_KEY);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as { iv: number[]; salt: number[]; ciphertext: number[] };
		const key = await deriveKey(password, new Uint8Array(parsed.salt));
		const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(parsed.iv) }, key, new Uint8Array(parsed.ciphertext));
		return new TextDecoder().decode(plaintext);
	} catch {
		return null;
	}
}

export function isOfflineWalletPresent(): boolean {
	if (typeof window === "undefined") return false;
	return !!window.localStorage.getItem(STORAGE_KEY);
}

export async function loginOfflineWithPrivateKey(privateKey: string, password: string): Promise<boolean> {
	try {
		await cachePrivateKeyEncrypted(privateKey, password);
		return true;
	} catch {
		return false;
	}
}

// Smart Contract Interaction Functions

export async function createListing(
	conn: HederaConnection,
	contractId: string,
	productId: string,
	seller: string,
	amount: string
): Promise<{ txId: string }> {
	const tx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setFunction("createEscrow", new ContractFunctionParameters()
			.addBytes32(new TextEncoder().encode(productId))
			.addAddress(seller)
		)
		.setPayableAmount(Hbar.fromTinybars(parseInt(amount)));

	const response = await tx.execute(conn.client);
	return { txId: response.transactionId.toString() };
}

export async function placeOrder(
	conn: HederaConnection,
	contractId: string,
	orderId: string,
	seller: string,
	amount: string
): Promise<{ txId: string }> {
	const tx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setFunction("createEscrow", new ContractFunctionParameters()
			.addBytes32(new TextEncoder().encode(orderId))
			.addAddress(seller)
		)
		.setPayableAmount(Hbar.fromTinybars(parseInt(amount)));

	const response = await tx.execute(conn.client);
	return { txId: response.transactionId.toString() };
}

export async function trackSupplyChain(
	conn: HederaConnection,
	contractId: string,
	productId: string
): Promise<any> {
	const query = new ContractCallQuery()
		.setContractId(contractId)
		.setFunction("getProductTraceability", new ContractFunctionParameters()
			.addBytes32(new TextEncoder().encode(productId))
		);

	const response = await query.execute(conn.client);
	return response.getBytes32(0);
}

export async function scheduleTransport(
	conn: HederaConnection,
	contractId: string,
	requestId: string,
	origin: string,
	destination: string,
	distance: number,
	weight: number,
	price: string
): Promise<{ txId: string }> {
	const tx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setFunction("createTransportRequest", new ContractFunctionParameters()
			.addBytes32(new TextEncoder().encode(requestId))
			.addString(origin)
			.addString(destination)
			.addUint256(distance)
			.addUint256(weight)
			.addUint256(parseInt(price))
		);

	const response = await tx.execute(conn.client);
	return { txId: response.transactionId.toString() };
}

export async function recordHealthData(
	conn: HederaConnection,
	contractId: string,
	recordId: string,
	animalId: string,
	animalType: string,
	breed: string,
	age: number,
	healthStatus: string
): Promise<{ txId: string }> {
	const tx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setFunction("createHealthRecord", new ContractFunctionParameters()
			.addBytes32(new TextEncoder().encode(recordId))
			.addBytes32(new TextEncoder().encode(animalId))
			.addString(animalType)
			.addString(breed)
			.addUint256(age)
			.addString(healthStatus)
		);

	const response = await tx.execute(conn.client);
	return { txId: response.transactionId.toString() };
}

export async function addSupplyChainStep(
	conn: HederaConnection,
	contractId: string,
	productId: string,
	action: string,
	location: string,
	metadata: string
): Promise<{ txId: string }> {
	const tx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setFunction("addSupplyChainStep", new ContractFunctionParameters()
			.addBytes32(new TextEncoder().encode(productId))
			.addString(action)
			.addString(location)
			.addString(metadata)
		);

	const response = await tx.execute(conn.client);
	return { txId: response.transactionId.toString() };
}

export async function performQualityCheck(
	conn: HederaConnection,
	contractId: string,
	productId: string,
	checkType: string,
	passed: boolean,
	notes: string
): Promise<{ txId: string }> {
	const tx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setFunction("performQualityCheck", new ContractFunctionParameters()
			.addBytes32(new TextEncoder().encode(productId))
			.addString(checkType)
			.addBool(passed)
			.addString(notes)
		);

	const response = await tx.execute(conn.client);
	return { txId: response.transactionId.toString() };
}

export async function scheduleConsultation(
	conn: HederaConnection,
	contractId: string,
	consultationId: string,
	farmer: string,
	issue: string,
	fee: string
): Promise<{ txId: string }> {
	const tx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setFunction("scheduleConsultation", new ContractFunctionParameters()
			.addBytes32(new TextEncoder().encode(consultationId))
			.addAddress(farmer)
			.addString(issue)
			.addUint256(parseInt(fee))
		);

	const response = await tx.execute(conn.client);
	return { txId: response.transactionId.toString() };
}

export async function createEquipmentLease(
	conn: HederaConnection,
	contractId: string,
	leaseId: string,
	equipmentType: string,
	equipmentName: string,
	dailyRate: string,
	duration: number
): Promise<{ txId: string }> {
	const tx = new ContractExecuteTransaction()
		.setContractId(contractId)
		.setFunction("createEquipmentLease", new ContractFunctionParameters()
			.addBytes32(new TextEncoder().encode(leaseId))
			.addString(equipmentType)
			.addString(equipmentName)
			.addUint256(parseInt(dailyRate))
			.addUint256(duration)
		);

	const response = await tx.execute(conn.client);
	return { txId: response.transactionId.toString() };
}
