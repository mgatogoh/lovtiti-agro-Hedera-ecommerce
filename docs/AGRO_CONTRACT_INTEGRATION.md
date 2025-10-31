# Agro Contract Integration

This document describes the integration of the Agro smart contract with the Lovtiti Agro Mart platform for wallet connections during signup and product purchases.

## Overview

The Agro contract provides a decentralized marketplace for agricultural products where:
- Farmers can register and add products
- Buyers can purchase products directly through the contract
- All transactions are recorded on the blockchain
- Farmers can manage their inventory and withdraw earnings

## Smart Contract

### Contract Address
The contract is deployed at: `NEXT_PUBLIC_AGRO_CONTRACT_ADDRESS`

### Key Functions

#### Farmer Management
- `createFarmer()` - Register as a farmer
- `whoFarmer(address)` - Get farmer information
- `withdrawBalance()` - Withdraw earned funds

#### Product Management
- `addProduct(uint price, uint amount)` - Add a new product
- `updateStock(uint stock, uint pid)` - Update product stock
- `increasePrice(uint price, uint pid)` - Update product price
- `viewProducts(address farmer)` - Get farmer's products

#### Purchasing
- `buyproduct(uint pid, uint amount)` - Buy a product (payable)

## API Endpoints

### Farmer Management
- `POST /api/agro/farmer/create` - Create farmer account
- `GET /api/agro/farmer/[address]` - Get farmer information
- `GET /api/agro/farmer/[address]/products` - Get farmer's products

### Product Management
- `POST /api/agro/products/add` - Add new product
- `PUT /api/agro/products/[productId]/stock` - Update product stock
- `PATCH /api/agro/products/[productId]/price` - Increase product price
- `GET /api/agro/products/[productId]` - Get product information

### Purchasing
- `POST /api/agro/purchase/buy` - Buy a product
- `PUT /api/agro/purchase/withdraw` - Withdraw farmer balance

## Frontend Integration

### Wallet Manager (`utils/walletManager.ts`)
Singleton class for managing wallet connections and contract interactions:
- MetaMask integration
- Private key connection (for testing)
- Farmer account creation
- Product management
- Purchase handling

### React Hook (`hooks/useWallet.ts`)
Custom hook providing easy access to wallet functionality:
- Wallet connection state
- Farmer status and information
- Product management functions
- Purchase functions
- Loading states

### Test Page (`app/agro-test/page.tsx`)
Complete test interface for all contract functionality:
- Wallet connection
- Farmer registration
- Product management
- Purchase testing

## Usage Examples

### Connect Wallet and Create Farmer Account

```typescript
import { useWallet } from '../hooks/useWallet';

function SignupPage() {
  const { connectWallet, createFarmerAccount, isFarmer } = useWallet();

  const handleSignup = async () => {
    // Connect wallet
    await connectWallet();
    
    // Create farmer account
    const result = await createFarmerAccount(userId);
    if (result.success) {
      console.log('Farmer created:', result.transactionHash);
    }
  };

  return (
    <button onClick={handleSignup}>
      {isFarmer ? 'Already a Farmer' : 'Become a Farmer'}
    </button>
  );
}
```

### Add Product

```typescript
const { addProduct } = useWallet();

const handleAddProduct = async () => {
  const result = await addProduct('1.0', 100, userId);
  if (result.success) {
    console.log('Product added:', result.transactionHash);
  }
};
```

### Buy Product

```typescript
const { buyProduct } = useWallet();

const handleBuyProduct = async () => {
  const result = await buyProduct('1', 10, '10.0', userId);
  if (result.success) {
    console.log('Product purchased:', result.transactionId);
  }
};
```

## Environment Variables

Add these to your `.env.local`:

```env
NEXT_PUBLIC_AGRO_CONTRACT_ADDRESS=0x...
AGRO_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_NETWORK=testnet
NETWORK=testnet
```

## Deployment

### Deploy Contract
```bash
cd smart-contracts
npx hardhat run scripts/deploy-agro.ts --network testnet
```

### Run Tests
```bash
npx hardhat test tests/agro.test.ts
```

## Security Considerations

1. **Private Key Handling**: The current implementation includes private key handling for testing. In production, implement secure key management.

2. **Input Validation**: All API endpoints validate input parameters and wallet addresses.

3. **Error Handling**: Comprehensive error handling for contract interactions.

4. **Gas Estimation**: Contract service includes gas estimation for transactions.

## Testing

1. Navigate to `/agro-test` to access the test interface
2. Connect your MetaMask wallet
3. Test farmer registration, product management, and purchases
4. Monitor transaction hashes and gas usage

## Integration with Existing Payment System

The agro contract payment method is integrated into the existing payment system:

```typescript
import { processPayment } from '../utils/payments';

const paymentRequest = {
  amount: 10.0,
  currency: 'ETH',
  paymentMethod: 'agro_contract',
  orderId: 'order-123',
  customerInfo: { email: 'user@example.com', name: 'John Doe' },
  productId: '1',
  walletAddress: '0x...',
  privateKey: '0x...',
  userId: 'user-123'
};

const result = await processPayment(paymentRequest);
```

## Future Enhancements

1. **Multi-signature Support**: Add support for multi-sig wallets
2. **Gas Optimization**: Optimize contract for lower gas costs
3. **Event Monitoring**: Real-time event monitoring for UI updates
4. **Batch Operations**: Support for batch product operations
5. **Price Oracle Integration**: Integrate with price oracles for dynamic pricing
