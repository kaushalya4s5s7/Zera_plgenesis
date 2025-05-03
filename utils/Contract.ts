export const CHAIN_CONFIG = {
  Educhain: {
    chainId: 656476,
    name: "Educhain Testnet",
    contractAddress: "0xc1140c23394322b65b99A6C6BdB33387f8A9432D",
    explorer: "https://edu-chain-testnet.blockscout.com/",
  },
  Pharos: {
    chainId: 50002,
    name: "Pharos Devnet",
    contractAddress: "0x233912C9FE3198A8CAF8AE493c2C970130cbC8B4", // Example ERC-20 Token
    explorer: "https://pharosscan.xyz/",
  },
} as const;

export type ChainKey = keyof typeof CHAIN_CONFIG;

export const CONTRACT_ADDRESSES = {
  Educhain: CHAIN_CONFIG.Educhain.contractAddress,
  Pharos: CHAIN_CONFIG.Pharos.contractAddress,
} as const;

export const AUDIT_REGISTRY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "contractHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "stars",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "string",
        name: "summary",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "auditor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "AuditRegistered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "contractHash",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "stars",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "summary",
        type: "string",
      },
    ],
    name: "registerAudit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "startIndex",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "getAllAudits",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "contractHashes",
        type: "bytes32[]",
      },
      {
        internalType: "uint8[]",
        name: "stars",
        type: "uint8[]",
      },
      {
        internalType: "string[]",
        name: "summaries",
        type: "string[]",
      },
      {
        internalType: "address[]",
        name: "auditors",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "timestamps",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "auditor",
        type: "address",
      },
    ],
    name: "getAuditorHistory",
    outputs: [
      {
        internalType: "bytes32[]",
        name: "",
        type: "bytes32[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "contractHash",
        type: "bytes32",
      },
    ],
    name: "getContractAudits",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "stars",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "summary",
            type: "string",
          },
          {
            internalType: "address",
            name: "auditor",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct AuditRegistry.AuditEntry[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getContractHashByIndex",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "contractHash",
        type: "bytes32",
      },
    ],
    name: "getLatestAudit",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "stars",
            type: "uint8",
          },
          {
            internalType: "string",
            name: "summary",
            type: "string",
          },
          {
            internalType: "address",
            name: "auditor",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
        ],
        internalType: "struct AuditRegistry.AuditEntry",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalContracts",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
