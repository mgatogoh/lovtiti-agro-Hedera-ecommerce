import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Contract ABI
const CONTRACT_ABI = [
  "function addProduct(uint256 price, uint256 amount) public returns (uint256)",
  "function increasePrice(uint256 price, uint256 pid) public",
  "function updateStock(uint256 stock, uint256 pid) public",
  "function createFarmer() public",
  "function buyproduct(uint256 pid, uint256 amount) public payable returns (uint256)",
  "function withdrawBalance() public returns (uint256)",
  "function whoFarmer(address user) public view returns (tuple(uint256[] products, uint256 balance, bool exists))",
  "function viewProducts(address _farmer) public view returns (tuple(uint256 price, address owner, uint256 stock, uint256 id)[])",
  "function products(uint256) public view returns (uint256 price, address owner, uint256 stock, uint256 id)",
  "function farmer(address) public view returns (uint256[] products, uint256 balance, bool exists)",
  "event productCreated(uint256 indexed productId, uint256 price, address farmer, uint256 amount)",
  "event farmerJoined(address farmer)",
  "event stockUpdated(uint256 amount, uint256 pid)",
  "event priceIncreased(uint256 price, uint256 pid)",
  "event productBought(uint256 indexed productId, address buyer, address farmer, uint256 amount, uint256 txid)",
  "event farmerEarnt(uint256 amount, address farmer, uint256 txid)"
];

// TypeScript interfaces
export interface Product {
  price: bigint;
  owner: string;
  stock: bigint;
  id: bigint;
}

export interface Farmer {
  products: bigint[];
  balance: bigint;
  exists: boolean;
}

export interface ContractState {
  contract: ethers.Contract | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  isConnected: boolean;
  chainId: number | null;
}

export async function ensureHederaTestnet() {
  if (!window.ethereum) throw new Error("No injected wallet");
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x128" }],
    });
  } catch (e: any) {
    if (e?.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x128",
          chainName: "Hedera Testnet",
          nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
          rpcUrls: ["https://testnet.hashio.io/api"],
          blockExplorerUrls: ["https://hashscan.io/testnet"],
        }],
      });
    } else {
      throw e;
    }
  }
}
export const useContract = (contractAddress: string) => {
  const [state, setState] = useState<ContractState>({
    contract: null,
    provider: null,
    signer: null,
    account: null,
    isConnected: false,
    chainId: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize contract connection
  const connectWallet = async () => {
    try {
        setLoading(true);
        setError(null);

        if (!window.ethereum) throw new Error('MetaMask is not installed');

        // Always switch/add Hedera Testnet first
        await ensureHederaTestnet();

        // Request accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Provider / signer (ethers v6)
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        // Hard gate: must be Hedera Testnet (296)
        if (Number(network.chainId) !== 296) {
        throw new Error(`Wrong network: expected Hedera Testnet (296), got ${network.chainId.toString()}`);
        }

        // Contract instance
        const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);

        setState({
        contract,
        provider,
        signer,
        account: accounts[0],
        isConnected: true,
        chainId: Number(network.chainId),
        });

        setLoading(false);
        return accounts[0];
    } catch (err: any) {
        setError(err.message || 'Failed to connect wallet');
        setLoading(false);
        throw err;
    }
    };


  // Disconnect wallet
  const disconnectWallet = () => {
    setState({
      contract: null,
      provider: null,
      signer: null,
      account: null,
      isConnected: false,
      chainId: null,
    });
  };

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setState((prev) => ({ ...prev, account: accounts[0] }));
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, []);
  const ensureFarmer = async (): Promise<{ created: boolean; exists: boolean }> => {
    if (!state.contract || !state.account) throw new Error('Contract not initialized');

    // 1) Try read: whoFarmer (will revert if not exists)
    let exists = false;
    try {
        const res = await state.contract.whoFarmer(state.account);
        // tuple: (uint256[] products, uint256 balance, bool exists)
        exists = Boolean(res[2]);
    } catch (e) {
        // Revert means "farmer does not exist"
        exists = false;
    }

    if (exists) return { created: false, exists: true };

    // 2) Create farmer
    const tx = await state.contract.createFarmer();
    await tx.wait();

    // 3) Confirm
    const res2 = await state.contract.whoFarmer(state.account);
    const nowExists = Boolean(res2[2]);
    if (!nowExists) throw new Error('createFarmer mined but farmer still missing');

    return { created: true, exists: true };
    };

  // Contract functions
  const createFarmer = async () => {
    if (!state.contract) throw new Error('Contract not initialized');
    try {
      const tx = await state.contract.createFarmer();
      await tx.wait();
      return tx;
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Transaction failed');
    }
  };

  const addProduct = async (price: string, amount: number) => {
    if (!state.contract) throw new Error('Contract not initialized');
    try {
      const priceInWei = ethers.parseEther(price);
      const tx = await state.contract.addProduct(priceInWei, amount);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Transaction failed');
    }
  };

  const increasePrice = async (productId: number, newPrice: string) => {
    if (!state.contract) throw new Error('Contract not initialized');
    try {
      const priceInWei = ethers.parseEther(newPrice);
      const tx = await state.contract.increasePrice(priceInWei, productId);
      await tx.wait();
      return tx;
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Transaction failed');
    }
  };

  const updateStock = async (productId: number, newStock: number) => {
    if (!state.contract) throw new Error('Contract not initialized');
    try {
      const tx = await state.contract.updateStock(newStock, productId);
      await tx.wait();
      return tx;
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Transaction failed');
    }
  };

  const buyProduct = async (productId: number, amount: number, totalPrice: string) => {
    if (!state.contract) throw new Error('Contract not initialized');
    try {
      const valueInWei = ethers.parseEther(totalPrice);
      const tx = await state.contract.buyproduct(productId, amount, {
        value: valueInWei,
      });
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Transaction failed');
    }
  };

  const withdrawBalance = async () => {
    if (!state.contract) throw new Error('Contract not initialized');
    try {
      const tx = await state.contract.withdrawBalance();
      await tx.wait();
      return tx;
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Transaction failed');
    }
  };

  // View functions
  const getFarmerInfo = async (address: string): Promise<Farmer> => {
    if (!state.contract) throw new Error('Contract not initialized');
    try {
      const result = await state.contract.whoFarmer(address);
      return {
        products: result[0],
        balance: result[1],
        exists: result[2],
      };
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Failed to fetch farmer info');
    }
  };

  const getProduct = async (productId: number): Promise<Product> => {
    if (!state.contract) throw new Error('Contract not initialized');
    try {
      const result = await state.contract.products(productId);
      return {
        price: result[0],
        owner: result[1],
        stock: result[2],
        id: result[3],
      };
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Failed to fetch product');
    }
  };

  const getFarmerProducts = async (farmerAddress: string): Promise<Product[]> => {
    if (!state.contract) throw new Error('Contract not initialized');
    try {
      const products = await state.contract.viewProducts(farmerAddress);
      return products.map((p: any) => ({
        price: p[0],
        owner: p[1],
        stock: p[2],
        id: p[3],
      }));
    } catch (err: any) {
      throw new Error(err.reason || err.message || 'Failed to fetch products');
    }
  };

  // Event listeners
  const listenToEvents = (callback: (event: any) => void) => {
    if (!state.contract) return;

    state.contract.on('productCreated', (productId, price, farmer, amount, event) => {
      callback({ type: 'productCreated', productId, price, farmer, amount, event });
    });

    state.contract.on('farmerJoined', (farmer, event) => {
      callback({ type: 'farmerJoined', farmer, event });
    });

    state.contract.on('stockUpdated', (amount, pid, event) => {
      callback({ type: 'stockUpdated', amount, pid, event });
    });

    state.contract.on('priceIncreased', (price, pid, event) => {
      callback({ type: 'priceIncreased', price, pid, event });
    });

    state.contract.on('productBought', (productId, buyer, farmer, amount, txid, event) => {
      callback({ type: 'productBought', productId, buyer, farmer, amount, txid, event });
    });

    state.contract.on('farmerEarnt', (amount, farmer, txid, event) => {
      callback({ type: 'farmerEarnt', amount, farmer, txid, event });
    });

    return () => {
      state.contract?.removeAllListeners();
    };
  };

  return {
    // State
    ...state,
    loading,
    error,

    // Connection functions
    connectWallet,
    disconnectWallet,
    ensureFarmer,

    // Write functions
    createFarmer,
    addProduct,
    increasePrice,
    updateStock,
    buyProduct,
    withdrawBalance,

    // Read functions
    getFarmerInfo,
    getProduct,
    getFarmerProducts,

    // Event listener
    listenToEvents,
  };
};

// Helper function to format Wei to Ether
export const formatEther = (wei: bigint): string => {
  return ethers.formatEther(wei);
};

// Helper function to parse Ether to Wei
export const parseEther = (ether: string): bigint => {
  return ethers.parseEther(ether);
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}