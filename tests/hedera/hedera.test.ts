import {
	connectHedera,
	signAndTransfer,
	cachePrivateKeyEncrypted,
	loadPrivateKeyDecrypted,
	isOfflineWalletPresent,
	createListing,
	placeOrder,
	trackSupplyChain,
	scheduleTransport,
	recordHealthData,
	addSupplyChainStep,
	performQualityCheck,
	scheduleConsultation,
	createEquipmentLease,
} from '../../utils/hedera';

// Mock Hedera SDK
jest.mock('@hashgraph/sdk', () => ({
	Client: {
		forTestnet: jest.fn(() => ({
			setOperator: jest.fn(),
		})),
		forMainnet: jest.fn(() => ({
			setOperator: jest.fn(),
		})),
	},
	PrivateKey: {
		fromString: jest.fn(() => ({})),
	},
	AccountId: {
		fromString: jest.fn(() => ({})),
	},
	TransferTransaction: jest.fn(() => ({
		addHbarTransfer: jest.fn(),
		execute: jest.fn(() => ({
			transactionId: { toString: () => 'test-tx-id' },
			getReceipt: jest.fn(),
		})),
	})),
	Hbar: {
		fromTinybars: jest.fn(() => ({})),
	},
	ContractExecuteTransaction: jest.fn(() => {
		const mockTx = {
			setContractId: jest.fn(() => mockTx),
			setFunction: jest.fn(() => mockTx),
			setPayableAmount: jest.fn(() => mockTx),
			execute: jest.fn(() => ({
				transactionId: { toString: () => 'test-tx-id' },
			})),
		};
		return mockTx;
	}),
	ContractCallQuery: jest.fn(() => ({
		setContractId: jest.fn(() => ({
			setFunction: jest.fn(() => ({
				execute: jest.fn(() => ({
					getBytes32: jest.fn(() => 'test-result'),
				})),
			})),
		})),
	})),
	ContractFunctionParameters: jest.fn(() => {
		const mockParams = {
			addBytes32: jest.fn(() => mockParams),
			addAddress: jest.fn(() => mockParams),
			addString: jest.fn(() => mockParams),
			addUint256: jest.fn(() => mockParams),
			addBool: jest.fn(() => mockParams),
		};
		return mockParams;
	}),
}));

// Mock crypto API
Object.defineProperty(global, 'crypto', {
	value: {
		subtle: {
			importKey: jest.fn(),
			deriveKey: jest.fn(),
			encrypt: jest.fn(),
			decrypt: jest.fn(),
		},
		getRandomValues: jest.fn(() => new Uint8Array(16)),
	},
});

// Mock localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

describe('Hedera Integration', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		localStorageMock.getItem.mockReturnValue(null);
	});

	describe('Wallet Connection', () => {
		it('should connect to Hedera testnet', async () => {
			const connection = await connectHedera('testnet', '0.0.123456', 'test-private-key');
			
			expect(connection).toBeDefined();
			expect(connection.accountId).toBe('0.0.123456');
			expect(connection.client).toBeDefined();
		});

		it('should connect to Hedera mainnet', async () => {
			const connection = await connectHedera('mainnet', '0.0.123456', 'test-private-key');
			
			expect(connection).toBeDefined();
			expect(connection.accountId).toBe('0.0.123456');
		});
	});

	describe('Key Management', () => {
		it('should cache encrypted private key', async () => {
			const privateKey = 'test-private-key';
			const password = 'test-password';

			await cachePrivateKeyEncrypted(privateKey, password);

			expect(localStorageMock.setItem).toHaveBeenCalledWith(
				'hedera_encrypted_key_v1',
				expect.any(String)
			);
		});

		it('should check if offline wallet is present', () => {
			localStorageMock.getItem.mockReturnValue('encrypted-key-data');
			
			const isPresent = isOfflineWalletPresent();
			
			expect(isPresent).toBe(true);
		});

		it('should return false when no offline wallet is present', () => {
			localStorageMock.getItem.mockReturnValue(null);
			
			const isPresent = isOfflineWalletPresent();
			
			expect(isPresent).toBe(false);
		});
	});

	describe('Smart Contract Interactions', () => {
		const mockConnection = {
			client: {},
			accountId: '0.0.123456',
		};

		it('should create listing', async () => {
			const result = await createListing(
				mockConnection,
				'contract-id',
				'product-123',
				'seller-address',
				'1000000'
			);

			expect(result.txId).toBe('test-tx-id');
		});

		it('should place order', async () => {
			const result = await placeOrder(
				mockConnection,
				'contract-id',
				'order-123',
				'seller-address',
				'1000000'
			);

			expect(result.txId).toBe('test-tx-id');
		});

		it('should track supply chain', async () => {
			const result = await trackSupplyChain(
				mockConnection,
				'contract-id',
				'product-123'
			);

			expect(result).toBe('test-result');
		});

		it('should schedule transport', async () => {
			const result = await scheduleTransport(
				mockConnection,
				'contract-id',
				'request-123',
				'Lagos',
				'Abuja',
				500,
				1000,
				'50000'
			);

			expect(result.txId).toBe('test-tx-id');
		});

		it('should record health data', async () => {
			const result = await recordHealthData(
				mockConnection,
				'contract-id',
				'record-123',
				'animal-456',
				'Cow',
				'Holstein',
				5,
				'Healthy'
			);

			expect(result.txId).toBe('test-tx-id');
		});

		it('should add supply chain step', async () => {
			const result = await addSupplyChainStep(
				mockConnection,
				'contract-id',
				'product-123',
				'Harvested',
				'Farm A',
				'Quality grade A'
			);

			expect(result.txId).toBe('test-tx-id');
		});

		it('should perform quality check', async () => {
			const result = await performQualityCheck(
				mockConnection,
				'contract-id',
				'product-123',
				'Pesticide Test',
				true,
				'All tests passed'
			);

			expect(result.txId).toBe('test-tx-id');
		});

		it('should schedule consultation', async () => {
			const result = await scheduleConsultation(
				mockConnection,
				'contract-id',
				'consultation-123',
				'farmer-address',
				'Crop disease',
				'10000'
			);

			expect(result.txId).toBe('test-tx-id');
		});

		it('should create equipment lease', async () => {
			const result = await createEquipmentLease(
				mockConnection,
				'contract-id',
				'lease-123',
				'Tractor',
				'John Deere 5075E',
				'5000',
				30
			);

			expect(result.txId).toBe('test-tx-id');
		});
	});

	describe('Transfer Transactions', () => {
		const mockConnection = {
			client: {},
			accountId: '0.0.123456',
		};

		it('should sign and transfer HBAR', async () => {
			const transfers = [
				{
					to: '0.0.789012',
					amountTinybar: '1000000',
				},
			];

			const result = await signAndTransfer(mockConnection, transfers);

			expect(result.txId).toBe('test-tx-id');
		});

		it('should handle multiple transfers', async () => {
			const transfers = [
				{
					to: '0.0.789012',
					amountTinybar: '1000000',
				},
				{
					to: '0.0.345678',
					amountTinybar: '500000',
				},
			];

			const result = await signAndTransfer(mockConnection, transfers);

			expect(result.txId).toBe('test-tx-id');
		});
	});

	describe('Error Handling', () => {
		it('should handle connection errors gracefully', async () => {
			// Mock a connection failure
			const connectHedera = jest.fn().mockRejectedValue(new Error('Connection failed'));

			await expect(connectHedera('testnet', 'invalid-account', 'invalid-key'))
				.rejects.toThrow('Connection failed');
		});

		it('should handle decryption errors gracefully', async () => {
			localStorageMock.getItem.mockReturnValue('invalid-encrypted-data');

			const result = await loadPrivateKeyDecrypted('wrong-password');

			expect(result).toBeNull();
		});
	});
});
