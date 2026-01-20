/* global BigInt */
// Wallet Integration & Web3 Support
// Supports MetaMask, WalletConnect, Phantom, etc.

export const WALLET_TYPES = {
  METAMASK: 'metamask',
  WALLETCONNECT: 'walletconnect',
  PHANTOM: 'phantom',
  COINBASE: 'coinbase'
};

export const SUPPORTED_CHAINS = {
  ETHEREUM: { id: 1, name: 'Ethereum', symbol: 'ETH', rpc: 'https://eth.llamarpc.com' },
  POLYGON: { id: 137, name: 'Polygon', symbol: 'MATIC', rpc: 'https://polygon-rpc.com' },
  ARBITRUM: { id: 42161, name: 'Arbitrum', symbol: 'ETH', rpc: 'https://arb1.arbitrum.io/rpc' }
};

export const PAYMENT_METHODS = {
  WALLET: 'wallet',
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal'
};

// Check if wallet is available
export const isWalletAvailable = (walletType) => {
  if (typeof window === 'undefined') return false;

  switch (walletType) {
    case WALLET_TYPES.METAMASK:
      return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
    case WALLET_TYPES.PHANTOM:
      return typeof window.phantom !== 'undefined' && window.phantom.solana !== 'undefined';
    case WALLET_TYPES.COINBASE:
      return typeof window.ethereum !== 'undefined' && window.ethereum.isCoinbaseWallet;
    default:
      return typeof window.ethereum !== 'undefined';
  }
};

// Get available wallets
export const getAvailableWallets = () => {
  const available = [];
  
  if (isWalletAvailable(WALLET_TYPES.METAMASK)) {
    available.push({
      type: WALLET_TYPES.METAMASK,
      name: 'MetaMask',
      icon: '🦊',
      supported: true
    });
  }
  
  if (isWalletAvailable(WALLET_TYPES.PHANTOM)) {
    available.push({
      type: WALLET_TYPES.PHANTOM,
      name: 'Phantom',
      icon: '👻',
      supported: true
    });
  }
  
  if (isWalletAvailable(WALLET_TYPES.COINBASE)) {
    available.push({
      type: WALLET_TYPES.COINBASE,
      name: 'Coinbase Wallet',
      icon: '◎',
      supported: true
    });
  }
  
  // Always show other options
  available.push({
    type: WALLET_TYPES.WALLETCONNECT,
    name: 'WalletConnect',
    icon: '🔗',
    supported: false
  });
  
  return available;
};

// Connect to MetaMask
export const connectMetaMask = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed. Please install MetaMask extension.');
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    
    // Get chain ID
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    return {
      address: account,
      chainId: parseInt(chainId, 16),
      walletType: WALLET_TYPES.METAMASK
    };
  } catch (error) {
    throw new Error(`Failed to connect MetaMask: ${error.message}`);
  }
};

// Connect to Phantom
export const connectPhantom = async () => {
  const phantom = window.phantom?.solana;
  
  if (!phantom) {
    throw new Error('Phantom not installed. Please install Phantom wallet.');
  }

  try {
    const response = await phantom.connect();
    return {
      address: response.publicKey.toString(),
      walletType: WALLET_TYPES.PHANTOM
    };
  } catch (error) {
    throw new Error(`Failed to connect Phantom: ${error.message}`);
  }
};

// Disconnect wallet
export const disconnectWallet = async (walletType) => {
  try {
    if (walletType === WALLET_TYPES.PHANTOM && window.phantom?.solana) {
      await window.phantom.solana.disconnect();
    }
    return true;
  } catch (error) {
    console.error('Failed to disconnect wallet:', error);
    return false;
  }
};

// Send transaction (for payment)
export const sendTransaction = async (walletType, to, amount, data = null) => {
  if (walletType === WALLET_TYPES.METAMASK) {
    return await sendEthereumTransaction(to, amount, data);
  } else if (walletType === WALLET_TYPES.PHANTOM) {
    return await sendSolanaTransaction(to, amount);
  }
  throw new Error('Unsupported wallet type for transactions');
};

// Ethereum transaction
const sendEthereumTransaction = async (to, amount, data = null) => {
  if (!window.ethereum) throw new Error('Ethereum provider not available');

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) throw new Error('No accounts available');

    const tx = {
      from: accounts[0],
      to,
      value: (BigInt(amount) * BigInt(10 ** 18)).toString(),
      ...(data && { data })
    };

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    });

    // Wait for transaction confirmation
    let receipt = null;
    for (let i = 0; i < 60; i++) {
      receipt = await window.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      });
      
      if (receipt) break;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return {
      txHash,
      status: receipt?.status === '0x1' ? 'success' : 'failed',
      receipt
    };
  } catch (error) {
    throw new Error(`Transaction failed: ${error.message}`);
  }
};

// Solana transaction (placeholder)
const sendSolanaTransaction = async (to, amount) => {
  // Implementation would use @solana/web3.js
  throw new Error('Solana transactions require additional setup');
};

// Get wallet balance
export const getWalletBalance = async (walletType, address) => {
  if (walletType === WALLET_TYPES.METAMASK) {
    return await getEthereumBalance(address);
  } else if (walletType === WALLET_TYPES.PHANTOM) {
    return await getSolanaBalance(address);
  }
  throw new Error('Unsupported wallet type');
};

// Get Ethereum balance
const getEthereumBalance = async (address) => {
  if (!window.ethereum) throw new Error('Ethereum provider not available');

  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    
    return (BigInt(balance) / BigInt(10 ** 18)).toString();
  } catch (error) {
    throw new Error(`Failed to get balance: ${error.message}`);
  }
};

// Get Solana balance (placeholder)
const getSolanaBalance = async (address) => {
  // Implementation would use Solana RPC
  throw new Error('Solana balance check requires additional setup');
};

// Watch account changes
export const watchAccountChanges = (callback) => {
  if (!window.ethereum) return;

  window.ethereum.on('accountsChanged', (accounts) => {
    callback({ type: 'accountsChanged', accounts });
  });

  window.ethereum.on('chainChanged', (chainId) => {
    callback({ type: 'chainChanged', chainId: parseInt(chainId, 16) });
  });

  return () => {
    window.ethereum?.removeAllListeners();
  };
};

// Transaction receipt utils
export const getTransactionStatus = async (txHash, chainId = 1) => {
  try {
    if (!window.ethereum) throw new Error('Ethereum provider not available');

    const receipt = await window.ethereum.request({
      method: 'eth_getTransactionReceipt',
      params: [txHash]
    });

    if (!receipt) return { status: 'pending' };
    
    return {
      status: receipt.status === '0x1' ? 'success' : 'failed',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      from: receipt.from,
      to: receipt.to
    };
  } catch (error) {
    console.error('Failed to get transaction status:', error);
    return { status: 'error', error: error.message };
  }
};

// Format address
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Validate address
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
