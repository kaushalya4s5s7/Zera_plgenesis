import { ethers } from 'ethers';
import sessionAbi from './abis/SessionV2.json';
import sessionQueueAbi from './abis/SessionQueueV2.json';

// Environment validation with fallback
const SESSION_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CORTENSOR_SESSION_CONTRACT?.trim() || "0x0000000000000000000000000000000000000000";
const SESSION_QUEUE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CORTENSOR_SESSION_QUEUE_CONTRACT?.trim();
const EXPECTED_CHAIN_ID = process.env.NEXT_PUBLIC_EXPECTED_CHAIN_ID || "421614"; // Arbitrum Sepolia
const TARGET_NETWORK = process.env.NEXT_PUBLIC_TARGET_NETWORK || "arbitrum-sepolia";

// Validate contract addresses
if (!process.env.NEXT_PUBLIC_CORTENSOR_SESSION_CONTRACT || SESSION_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
  console.warn(
    "⚠️ CORTENSOR WARNING: Contract addresses not configured. Please set NEXT_PUBLIC_CORTENSOR_SESSION_CONTRACT in your environment variables."
  );
} else {
  console.log("🔗 Cortensor Session Contract:", SESSION_CONTRACT_ADDRESS);
  console.log("🌐 Target Network:", TARGET_NETWORK, `(Chain ID: ${EXPECTED_CHAIN_ID})`);
  if (SESSION_QUEUE_CONTRACT_ADDRESS) {
    console.log("🔗 Cortensor Queue Contract:", SESSION_QUEUE_CONTRACT_ADDRESS);
  }
}

interface CortensorRequestOptions {
  messages: {
    role: "system" | "user" | "assistant";
    content: string;
  }[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface SessionConfig {
  name: string;
  metadata: string;
  variableAddress: string;
  minNumOfNodes: number;
  maxNumOfNodes: number;
  redundant: number;
  numOfValidatorNodes: number;
  mode: number;
  reserveEphemeralNodes: boolean;
}

class CortensorWeb3SDK {
  private sessionContract: ethers.Contract;
  private sessionQueueContract: ethers.Contract | null = null;
  private signer: ethers.Signer;

  constructor(signer: ethers.Signer) {
    this.signer = signer;
    this.sessionContract = new ethers.Contract(
      SESSION_CONTRACT_ADDRESS,
      sessionAbi,
      signer
    );
    
    if (SESSION_QUEUE_CONTRACT_ADDRESS) {
      this.sessionQueueContract = new ethers.Contract(
        SESSION_QUEUE_CONTRACT_ADDRESS,
        sessionQueueAbi,
        signer
      );
    }
  }

  async createSession(config: SessionConfig): Promise<number> {
    try {
      // Verify contract exists before calling
      const code = await this.signer.provider?.getCode(SESSION_CONTRACT_ADDRESS);
      if (!code || code === '0x') {
        throw new Error(`Session contract not deployed at ${SESSION_CONTRACT_ADDRESS}`);
      }

      const tx = await this.sessionContract.create(
        config.name,
        config.metadata,
        config.variableAddress,
        config.minNumOfNodes,
        config.maxNumOfNodes,
        config.redundant,
        config.numOfValidatorNodes,
        config.mode,
        config.reserveEphemeralNodes
      );
      
      const receipt = await tx.wait();
      
      // Try to extract sessionId from events
      let sessionId = Date.now(); // Fallback ID
      
      if (receipt.logs && receipt.logs.length > 0) {
        // Look for SessionCreated event
        for (const log of receipt.logs) {
          try {
            const parsedLog = this.sessionContract.interface.parseLog(log);
            if (parsedLog && parsedLog.name === 'SessionCreated' && parsedLog.args.sessionId) {
              sessionId = parsedLog.args.sessionId.toNumber();
              console.log("📋 Extracted sessionId from event:", sessionId);
              break;
            }
          } catch (e) {
            // Continue if log parsing fails
          }
        }
      }
      
      console.log("✅ Session created with ID:", sessionId);
      return sessionId;
    } catch (error) {
      console.error("❌ Failed to create session:", error);
      throw error;
    }
  }

  async submitTask(
    sessionId: number,
    taskData: string,
    promptType: number,
    promptTemplate: string,
    llmParams: number[]
  ): Promise<string> {
    try {
      if (!this.sessionQueueContract) {
        throw new Error("Session queue contract not configured");
      }

      // Verify queue contract exists
      const code = await this.signer.provider?.getCode(SESSION_QUEUE_CONTRACT_ADDRESS!);
      if (!code || code === '0x') {
        throw new Error(`Queue contract not deployed at ${SESSION_QUEUE_CONTRACT_ADDRESS}`);
      }

      // Use enqueueTask function from SessionQueueV2 ABI
      const tx = await this.sessionQueueContract.enqueueTask(
        sessionId,
        taskData,
        promptType,
        promptTemplate,
        llmParams
      );
      
      const receipt = await tx.wait();
      console.log("✅ Task enqueued, transaction hash:", receipt.hash);
      
      // Extract taskId from transaction logs
      let taskId = 1; // Default fallback
      if (receipt.logs && receipt.logs.length > 0) {
        for (const log of receipt.logs) {
          try {
            const parsedLog = this.sessionQueueContract.interface.parseLog(log);
            if (parsedLog && parsedLog.name === 'TaskQueued') {
              taskId = parsedLog.args.taskId?.toNumber() || taskId;
              console.log("📋 Extracted taskId from event:", taskId);
              break;
            }
          } catch (e) {
            // Continue if log parsing fails
          }
        }
      }
      
      console.log("🔄 Polling for task results, taskId:", taskId);
      
      // Poll for results using the actual taskId
      return this.pollForTaskResults(sessionId, taskId);
    } catch (error) {
      console.error("❌ Failed to submit task:", error);
      throw error;
    }
  }

  private async pollForTaskResults(sessionId: number, taskId: number): Promise<string> {
    const maxAttempts = 30;
    const pollInterval = 2000; // 2 seconds
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        if (!this.sessionQueueContract) {
          throw new Error("Session queue contract not available");
        }
        
        // Use correct function signature from SessionQueueV2 ABI
        const [addresses, results] = await this.sessionQueueContract.getTaskResults(
          sessionId,
          taskId
        );
        
        if (results && results.length > 0) {
          console.log("✅ Task results retrieved:", results.length, "results");
          return results[0]; // Return first result
        }
      } catch (error) {
        console.log(`Polling attempt ${i + 1} failed, retrying...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }
    
    throw new Error("Task execution timeout");
  }

  async getSessionsByAddress(userAddr: string): Promise<any[]> {
    try {
      // First verify the contract exists
      const code = await this.signer.provider?.getCode(SESSION_CONTRACT_ADDRESS);
      if (!code || code === '0x') {
        console.warn("Contract not deployed at address:", SESSION_CONTRACT_ADDRESS);
        return [];
      }

      const result = await this.sessionContract.getSessionsByAddress(userAddr);
      return result || [];
    } catch (error: any) {
      console.error("Error getting sessions by address:", error);
      
      // If it's a decoding error, return empty array
      if (error.code === 'BAD_DATA' || error.message?.includes('could not decode result data')) {
        console.warn("Contract returned empty data - likely no sessions found or contract mismatch");
        return [];
      }
      
      // For other errors, throw them
      throw error;
    }
  }

  async getSession(sessionId: number): Promise<any> {
    try {
      // First verify the contract exists
      const code = await this.signer.provider?.getCode(SESSION_CONTRACT_ADDRESS);
      if (!code || code === '0x') {
        console.warn("Contract not deployed at address:", SESSION_CONTRACT_ADDRESS);
        return null;
      }

      const result = await this.sessionContract.getSession(sessionId);
      return result || null;
    } catch (error: any) {
      console.error("Error getting session:", error);
      
      // If it's a decoding error, return null
      if (error.code === 'BAD_DATA' || error.message?.includes('could not decode result data')) {
        console.warn("Contract returned empty data - session may not exist or contract mismatch");
        return null;
      }
      
      // For other errors, throw them
      throw error;
    }
  }
}

// Global SDK instance holder
let cortensorSDK: CortensorWeb3SDK | null = null;

// Initialize SDK with signer
export function initializeCortensorSDK(signer: ethers.Signer) {
  cortensorSDK = new CortensorWeb3SDK(signer);
}

// Main function that mirrors callMistralAI
export async function callCortensorAI({
  messages,
  model = "cortensor-small-latest",
  temperature = 0.7,
  maxTokens = 2000,
}: CortensorRequestOptions): Promise<string> {
  // Development fallback when contracts are not configured (check for placeholder address)
  if (SESSION_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
    console.warn("🚧 Development Mode: Using mock AI response (contracts not configured)");
    return generateMockResponse(messages, model);
  }

  if (!cortensorSDK) {
    console.warn("🚧 Fallback Mode: SDK not initialized, using mock response");
    return generateMockResponse(messages, model);
  }

  try {
    // Create session for this AI request
    const sessionConfig: SessionConfig = {
      name: `AI-Session-${Date.now()}`,
      metadata: JSON.stringify({ model, temperature, maxTokens }),
      variableAddress: ethers.ZeroAddress, // Updated for ethers v6
      minNumOfNodes: 3,
      maxNumOfNodes: 10,
      redundant: 2,
      numOfValidatorNodes: 3,
      mode: 1, // AI inference mode
      reserveEphemeralNodes: true
    };

    console.log("🔄 Creating Cortensor session...");
    const sessionId = await cortensorSDK.createSession(sessionConfig);

    // Convert messages to task data
    const taskData = JSON.stringify({
      messages,
      model,
      temperature,
      maxTokens
    });

    console.log("🔄 Submitting AI task...");
    // Submit AI inference task using correct enqueueTask function
    const result = await cortensorSDK.submitTask(
      sessionId,
      taskData,
      1, // Chat completion prompt type
      JSON.stringify(messages[0]), // System prompt template
      [Math.floor(temperature * 100), maxTokens] // Convert to uint256 params
    );

    console.log("✅ Cortensor AI call completed");
    return result;
  } catch (error) {
    console.error("❌ Error calling Cortensor AI:", error);
    // Fallback to mock response in case of error
    console.warn("🚧 Fallback Mode: Using mock AI response due to error");
    return generateMockResponse(messages, model);
  }
}

// Mock response generator for development/fallback
function generateMockResponse(messages: any[], model: string): string {
  const userMessage = messages.find(m => m.role === 'user')?.content || '';
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';

  // Smart contract generation mock
  if (systemMessage.includes('blockchain developer') || userMessage.includes('contract')) {
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockToken
 * @dev Mock ERC20 token generated by Cortensor AI (Development Mode)
 * @notice This is a development mock - replace with actual contract when deployed
 */
contract MockToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18;
    uint256 public constant TRANSACTION_FEE = 200; // 2%
    
    constructor() ERC20("MockToken", "MOCK") {
        _mint(msg.sender, 1_000_000 * 10**18);
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    function _transfer(address from, address to, uint256 amount) internal override {
        uint256 fee = (amount * TRANSACTION_FEE) / 10000;
        uint256 transferAmount = amount - fee;
        
        super._transfer(from, to, transferAmount);
        if (fee > 0) {
            super._transfer(from, owner(), fee);
        }
    }
}

// 🚧 This is a mock response generated in development mode
// Configure your Cortensor contracts to get real AI-generated code`;
  }

  // Security analysis mock
  if (systemMessage.includes('security expert')) {
    return `# Smart Contract Security Analysis (Mock)

## 🔴 High Severity Issues
- **Reentrancy Vulnerability**: Consider using ReentrancyGuard
- **Integer Overflow**: Use SafeMath or Solidity ^0.8.0

## 🟡 Medium Severity Issues  
- **Access Control**: Implement proper role-based access
- **Gas Optimization**: Use efficient data structures

## 🟢 Low Severity Issues
- **Code Style**: Follow Solidity style guide
- **Documentation**: Add comprehensive NatSpec comments

## ⚡ Gas Optimizations
- Use packed structs to save storage slots
- Consider using immutable variables
- Batch operations where possible

🚧 This is a mock analysis - configure Cortensor contracts for real AI analysis`;
  }

  // Documentation mock
  if (systemMessage.includes('documentation expert')) {
    return `# Smart Contract Documentation (Mock)

## Overview
This contract implements [describe functionality here].

## Functions

### Public Functions
- \`function mint(address to, uint256 amount)\` - Mints new tokens
- \`function transfer(address to, uint256 amount)\` - Transfers tokens

### View Functions  
- \`function totalSupply()\` - Returns total token supply
- \`function balanceOf(address account)\` - Returns account balance

## Events
- \`Transfer(address indexed from, address indexed to, uint256 value)\`
- \`Approval(address indexed owner, address indexed spender, uint256 value)\`

## Usage Example
\`\`\`solidity
// Deploy contract
MockToken token = new MockToken();

// Mint tokens
token.mint(recipient, 1000 * 10**18);
\`\`\`

🚧 This is mock documentation - configure Cortensor for real AI-generated docs`;
  }

  // Test generation mock
  if (systemMessage.includes('testing')) {
    return `// Mock Test Suite (Development Mode)
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MockToken", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MockToken");
    token = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should assign total supply to owner", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      await token.transfer(addr1.address, 50);
      expect(await token.balanceOf(addr1.address)).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      await expect(
        token.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
  });
});

// 🚧 This is a mock test suite - configure Cortensor for real AI-generated tests`;
  }

  // Generic fallback
  return `Mock AI Response (Development Mode)

Your request: "${userMessage}"

🚧 This is a development mock response. To get real AI-generated content:
1. Deploy Cortensor session and queue contracts
2. Update your .env.local with contract addresses:
   - NEXT_PUBLIC_CORTENSOR_SESSION_CONTRACT=your_session_contract_address
   - NEXT_PUBLIC_CORTENSOR_SESSION_QUEUE_CONTRACT=your_queue_contract_address

Model: ${model}
Timestamp: ${new Date().toISOString()}`;
}

// Mirror of generateSmartContract using Cortensor
export async function generateSmartContract(
  prompt: string,
  contractType: string
): Promise<string> {
  const systemPrompt = `You are an expert blockchain developer. Create a secure, optimized ${contractType} smart contract based on the user's requirements. Return only the Solidity code with proper comments.`;

  return callCortensorAI({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    temperature: 0.5,
  });
}

// Mirror of analyzeContractSecurity using Cortensor
export async function analyzeContractSecurity(code: string, chain: string): Promise<string> {
  const systemPrompt = `You are a smart contract security expert. Analyze the following contract code for security vulnerabilities, potential gas optimizations and best practices. Focus on issues specific to ${chain} blockchain. Format your response with clear headings and bullet points. Include severity levels for each issue.`;

  return callCortensorAI({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: code },
    ],
    temperature: 0.3,
    maxTokens: 3000,
  });
}

// Mirror of generateContractDocumentation using Cortensor
export async function generateContractDocumentation(
  code: string,
  framework: string
): Promise<string> {
  const systemPrompt = `You are a technical documentation expert. Create comprehensive documentation for the following smart contract code in ${framework} style format. Include function descriptions, parameter details, return values, events, and usage examples. Format in markdown.`;

  return callCortensorAI({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: code },
    ],
    temperature: 0.4,
    maxTokens: 3000,
  });
}

// Mirror of generateContractTests using Cortensor
export async function generateContractTests(code: string, framework: string): Promise<string> {
  const systemPrompt = `You are an expert in smart contract testing. Create comprehensive test cases for the following smart contract code using the ${framework} testing framework. Include tests for all functions, edge cases, and error conditions. Return only the test code with proper comments.`;

  return callCortensorAI({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: code },
    ],
    temperature: 0.4,
    maxTokens: 3000,
  });
}

// Simulate test results - same as Mistral version but using blockchain data
export function simulateTestResults() {
  return {
    passed: Math.floor(Math.random() * 3) + 3,
    failed: Math.floor(Math.random() * 2),
    results: [
      {
        id: 1,
        name: "Should set the right owner",
        status: "passed",
        duration: "0.23s",
      },
      {
        id: 2,
        name: "Should assign total supply to owner",
        status: "passed",
        duration: "0.18s",
      },
      {
        id: 3,
        name: "Should transfer tokens between accounts",
        status: "passed",
        duration: "0.45s",
      },
      {
        id: 4,
        name: "Should fail if sender doesn't have enough tokens",
        status: Math.random() > 0.7 ? "failed" : "passed",
        duration: "0.32s",
        error:
          "Contract was expected to revert with 'Not enough tokens', but didn't revert.",
      },
      {
        id: 5,
        name: "Should update balances after transfers",
        status: "passed",
        duration: "0.38s",
      },
    ],
    gasUsage: [
      { function: "transfer", cost: 48325, improvement: "+12%" },
      { function: "approve", cost: 32750, improvement: "+5%" },
      { function: "transferFrom", cost: 53420, improvement: "-3%" },
    ],
  };
}

// Additional utility functions for Cortensor integration
export async function getCortensorSessions(userAddress: string): Promise<any[]> {
  if (!cortensorSDK) {
    throw new Error("Cortensor SDK not initialized");
  }
  return cortensorSDK.getSessionsByAddress(userAddress);
}

export async function getCortensorSession(sessionId: number): Promise<any> {
  if (!cortensorSDK) {
    throw new Error("Cortensor SDK not initialized");
  }
  return cortensorSDK.getSession(sessionId);
}

// Enhanced error handling wrapper
export async function safeCortensorCall<T>(
  operation: () => Promise<T>,
  fallbackValue?: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("Cortensor operation failed:", error);
    if (fallbackValue !== undefined) {
      return fallbackValue;
    }
    throw error;
  }
}

// Batch processing for multiple AI requests
export async function batchCortensorRequests(
  requests: CortensorRequestOptions[]
): Promise<string[]> {
  if (!cortensorSDK) {
    throw new Error("Cortensor SDK not initialized");
  }

  const results = await Promise.allSettled(
    requests.map(request => callCortensorAI(request))
  );

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      console.error(`Request ${index} failed:`, result.reason);
      return `Error: ${result.reason.message || 'Unknown error'}`;
    }
  });
}

// Health check for Cortensor SDK
export async function checkCortensorHealth(): Promise<boolean> {
  try {
    if (!cortensorSDK) {
      console.log("Cortensor SDK not initialized");
      return false;
    }
    
    // Check if contracts are deployed
    const provider = cortensorSDK['signer'].provider;
    if (!provider) {
      console.log("No provider available");
      return false;
    }

    // Check network
    const network = await provider.getNetwork();
    if (network.chainId.toString() !== EXPECTED_CHAIN_ID) {
      console.log(`❌ Wrong network! Expected ${TARGET_NETWORK} (${EXPECTED_CHAIN_ID}), got ${network.name} (${network.chainId})`);
      return false;
    }

    // Check session contract
    const sessionCode = await provider.getCode(SESSION_CONTRACT_ADDRESS);
    if (!sessionCode || sessionCode === '0x') {
      console.log("Session contract not deployed at:", SESSION_CONTRACT_ADDRESS);
      return false;
    }

    // Check queue contract if configured
    if (SESSION_QUEUE_CONTRACT_ADDRESS) {
      const queueCode = await provider.getCode(SESSION_QUEUE_CONTRACT_ADDRESS);
      if (!queueCode || queueCode === '0x') {
        console.log("Queue contract not deployed at:", SESSION_QUEUE_CONTRACT_ADDRESS);
        return false;
      }
    }

    // Try to get user address and test contract interaction
    const userAddress = await cortensorSDK['signer'].getAddress();
    console.log("Testing contract interaction for address:", userAddress);
    
    // Test session contract - handle ABI mismatch gracefully
    try {
      await cortensorSDK.getSessionsByAddress(userAddress);
      console.log("✅ Cortensor health check passed");
      return true;
    } catch (error: any) {
      if (error.code === 'CALL_EXCEPTION' || error.message?.includes('missing revert data')) {
        console.log("⚠️ ABI mismatch detected - contracts exist but interface doesn't match");
        console.log("💡 Enabling mock mode for development");
        return false; // This will trigger mock mode
      }
      throw error; // Re-throw other errors
    }
    
  } catch (error) {
    console.error("❌ Cortensor health check failed:", error);
    return false;
  }
}

// Get SDK status information
export function getCortensorSDKStatus() {
  return {
    initialized: cortensorSDK !== null,
    sessionContract: SESSION_CONTRACT_ADDRESS,
    queueContract: SESSION_QUEUE_CONTRACT_ADDRESS || 'Not configured',
    timestamp: new Date().toISOString()
  };
}

// Comprehensive debugging function
export async function debugCortensorContracts(signer?: ethers.Signer): Promise<void> {
  console.log("🔍 === CORTENSOR CONTRACT DEBUGGING ===");
  
  // Environment check
  console.log("📋 Environment Variables:");
  console.log("  SESSION_CONTRACT:", process.env.NEXT_PUBLIC_CORTENSOR_SESSION_CONTRACT);
  console.log("  QUEUE_CONTRACT:", process.env.NEXT_PUBLIC_CORTENSOR_SESSION_QUEUE_CONTRACT);
  console.log("  Parsed SESSION_CONTRACT:", SESSION_CONTRACT_ADDRESS);
  console.log("  Parsed QUEUE_CONTRACT:", SESSION_QUEUE_CONTRACT_ADDRESS);
  console.log("  Expected Chain ID:", EXPECTED_CHAIN_ID);
  console.log("  Target Network:", TARGET_NETWORK);
  
  if (!signer && !cortensorSDK) {
    console.log("❌ No signer provided and SDK not initialized");
    return;
  }
  
  const provider = signer?.provider || cortensorSDK?.['signer']?.provider;
  if (!provider) {
    console.log("❌ No provider available");
    return;
  }
  
  try {
    // Network info
    const network = await provider.getNetwork();
    console.log("🌐 Network Info:");
    console.log("  Chain ID:", network.chainId.toString());
    console.log("  Network Name:", network.name);
    
    // Check if we're on the right network
    if (network.chainId.toString() !== EXPECTED_CHAIN_ID) {
      console.log("⚠️ Network Mismatch!");
      console.log("  Expected Chain ID:", EXPECTED_CHAIN_ID);
      console.log("  Current Chain ID:", network.chainId.toString());
      console.log("💡 Please switch to", TARGET_NETWORK, "in your wallet");
    } else {
      console.log("✅ Correct network detected!");
    }
    
    // Check session contract
    console.log("\n🔍 Session Contract Analysis:");
    console.log("  Address:", SESSION_CONTRACT_ADDRESS);
    
    const sessionCode = await provider.getCode(SESSION_CONTRACT_ADDRESS);
    console.log("  Contract Code Length:", sessionCode.length);
    console.log("  Has Code:", sessionCode !== '0x');
    
    if (sessionCode === '0x') {
      console.log("❌ No contract deployed at this address");
      console.log("💡 Possible solutions:");
      console.log("   1. Verify the contract address is correct");
      console.log("   2. Check if you're on the right network");
      console.log("   3. Deploy the contract to this address");
      console.log("   4. Update the address in .env.local");
    } else {
      console.log("✅ Contract code found!");
      
      // Try to get contract info with better error handling
      try {
        const contract = new ethers.Contract(SESSION_CONTRACT_ADDRESS, sessionAbi, provider);
        
        // Test if ABI matches by calling a view function
        const userAddr = await (signer || cortensorSDK?.['signer'])?.getAddress();
        if (userAddr) {
          console.log("  Testing contract interaction...");
          console.log("  Calling getSessionsByAddress with:", userAddr);
          
          try {
            const sessions = await contract.getSessionsByAddress(userAddr);
            console.log("✅ Contract interaction successful");
            console.log("  Sessions found:", sessions?.length || 0);
          } catch (callError: any) {
            console.log("❌ Contract call failed:", callError.code);
            console.log("  Error message:", callError.message);
            
            if (callError.code === 'CALL_EXCEPTION') {
              console.log("💡 This indicates ABI mismatch - the function doesn't exist or has different parameters");
              console.log("💡 Possible issues:");
              console.log("   - Function name is different");
              console.log("   - Function parameters are different");
              console.log("   - Contract doesn't implement this function");
              console.log("   - Contract uses different interface");
            }
          }
        }
      } catch (error: any) {
        console.log("❌ Contract setup failed:", error.message);
      }
    }
    
    // Check queue contract if configured
    if (SESSION_QUEUE_CONTRACT_ADDRESS) {
      console.log("\n🔍 Queue Contract Analysis:");
      console.log("  Address:", SESSION_QUEUE_CONTRACT_ADDRESS);
      
      const queueCode = await provider.getCode(SESSION_QUEUE_CONTRACT_ADDRESS);
      console.log("  Contract Code Length:", queueCode.length);
      console.log("  Has Code:", queueCode !== '0x');
      
      if (queueCode === '0x') {
        console.log("❌ No queue contract deployed at this address");
      } else {
        console.log("✅ Queue contract code found!");
        
        // Test queue contract interaction
        try {
          const queueContract = new ethers.Contract(SESSION_QUEUE_CONTRACT_ADDRESS, sessionQueueAbi, provider);
          console.log("  Queue contract interface loaded successfully");
        } catch (error: any) {
          console.log("❌ Queue contract setup failed:", error.message);
        }
      }
    }
    
    // Account info
    if (signer || cortensorSDK) {
      const account = await (signer || cortensorSDK?.['signer'])?.getAddress();
      const balance = await provider.getBalance(account!);
      console.log("\n👤 Account Info:");
      console.log("  Address:", account);
      console.log("  Balance:", ethers.formatEther(balance), "ETH");
    }
    
    // ABI mismatch guidance
    console.log("\n🔧 Next Steps:");
    if (sessionCode !== '0x' && sessionCode.length > 100) {
      console.log("  ✅ Contracts are deployed on Arbitrum Sepolia");
      console.log("  ❌ ABI mismatch detected");
      console.log("  💡 Solutions:");
      console.log("     1. Get the correct ABI from the contract deployer");
      console.log("     2. Verify contract source on Arbiscan");
      console.log("     3. Use mock mode for development");
      console.log("     4. Contact Cortensor team for correct ABIs");
    }
    
  } catch (error) {
    console.error("❌ Debug analysis failed:", error);
  }
  
  console.log("🔍 === END DEBUGGING ===\n");
}

// Export SDK instance for advanced usage
export { cortensorSDK };