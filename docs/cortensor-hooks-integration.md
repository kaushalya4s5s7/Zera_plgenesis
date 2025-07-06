# Cortensor Web3 SDK - React Hooks Integration

This documentation explains how to use the refactored Cortensor Web3 SDK with React hooks integration, which replaces direct ethers.js usage with wagmi/viem-compatible hooks.

## Overview

The Cortensor SDK has been refactored to work seamlessly with React applications using wagmi and viem. Instead of directly using ethers.js providers and signers, the SDK now integrates with the custom `useEthersSigner` and `useEthersProvider` hooks.

## Key Changes

### Before (Direct ethers.js usage)
```typescript
import { ethers } from 'ethers';
import { initializeCortensorSDK } from '@/utils/Cortensor';

// Direct ethers setup
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
initializeCortensorSDK(signer);
```

### After (React hooks integration)
```typescript
import { useCortensor } from '@/hooks/useCortensor';

function MyComponent() {
  const cortensor = useCortensor({
    chainId: 421614, // Arbitrum Sepolia
    autoInitialize: true
  });

  // SDK automatically initializes when wallet is connected
  console.log('SDK Ready:', cortensor.isReady);
  console.log('SDK Healthy:', cortensor.isHealthy);
}
```

## Available Hooks

### 1. `useCortensor` - Main SDK Hook

The primary hook for Cortensor SDK integration.

```typescript
import { useCortensor } from '@/hooks/useCortensor';

function Component() {
  const cortensor = useCortensor({
    chainId: 421614, // Optional: target chain ID
    autoInitialize: true // Optional: auto-initialize when signer available
  });

  const {
    isInitialized,    // SDK has been initialized
    isReady,          // SDK is ready for use (contracts configured)
    isHealthy,        // Contracts are deployed and working
    loading,          // Initialization in progress
    error,            // Initialization error
    signer,           // Current ethers signer
    provider,         // Current ethers provider
    initialize,       // Manual initialization function
    healthCheck,      // Manual health check function
    getStatus         // Get detailed SDK status
  } = cortensor;

  return (
    <div>
      <p>SDK Status: {isHealthy ? 'Online' : 'Offline'}</p>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### 2. `useCortensorAI` - AI Call Hook

For making general AI requests to Cortensor.

```typescript
import { useCortensorAI } from '@/hooks/useCortensor';

function AIComponent() {
  const { callAI, loading, error } = useCortensorAI();

  const handleAIRequest = async () => {
    try {
      const result = await callAI({
        messages: [
          { role: "system", content: "You are a helpful AI assistant" },
          { role: "user", content: "Explain blockchain technology" }
        ],
        model: "cortensor-small-latest",
        temperature: 0.7,
        maxTokens: 1000
      });
      console.log('AI Response:', result);
    } catch (err) {
      console.error('AI call failed:', err);
    }
  };

  return (
    <button onClick={handleAIRequest} disabled={loading}>
      {loading ? 'Generating...' : 'Ask AI'}
    </button>
  );
}
```

### 3. `useCortensorContractGeneration` - Smart Contract Generation

For AI-powered smart contract generation.

```typescript
import { useCortensorContractGeneration } from '@/hooks/useCortensor';

function ContractBuilder() {
  const { generateContract, loading, error } = useCortensorContractGeneration();

  const handleGenerate = async () => {
    try {
      const contract = await generateContract(
        "Create an ERC20 token with minting and burning capabilities",
        "ERC20"
      );
      console.log('Generated Contract:', contract);
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  return (
    <button onClick={handleGenerate} disabled={loading}>
      {loading ? 'Generating...' : 'Generate Contract'}
    </button>
  );
}
```

### 4. `useCortensorSecurityAnalysis` - Security Analysis

For AI-powered smart contract security analysis.

```typescript
import { useCortensorSecurityAnalysis } from '@/hooks/useCortensor';

function SecurityAnalyzer() {
  const { analyzeContract, loading, error } = useCortensorSecurityAnalysis();

  const handleAnalyze = async (contractCode: string) => {
    try {
      const analysis = await analyzeContract(contractCode, "Arbitrum");
      console.log('Security Analysis:', analysis);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  return (
    <button onClick={() => handleAnalyze(contractCode)} disabled={loading}>
      {loading ? 'Analyzing...' : 'Analyze Security'}
    </button>
  );
}
```

### 5. `useCortensorDocumentation` - Documentation Generation

For AI-powered contract documentation.

```typescript
import { useCortensorDocumentation } from '@/hooks/useCortensor';

function DocumentationGenerator() {
  const { generateDocs, loading, error } = useCortensorDocumentation();

  const handleGenerateDocs = async (contractCode: string) => {
    try {
      const docs = await generateDocs(contractCode, "markdown");
      console.log('Generated Documentation:', docs);
    } catch (err) {
      console.error('Documentation generation failed:', err);
    }
  };

  return (
    <button onClick={() => handleGenerateDocs(contractCode)} disabled={loading}>
      {loading ? 'Generating...' : 'Generate Docs'}
    </button>
  );
}
```

### 6. `useCortensorTestGeneration` - Test Generation

For AI-powered test suite generation.

```typescript
import { useCortensorTestGeneration } from '@/hooks/useCortensor';

function TestGenerator() {
  const { generateTests, loading, error } = useCortensorTestGeneration();

  const handleGenerateTests = async (contractCode: string) => {
    try {
      const tests = await generateTests(contractCode, "hardhat");
      console.log('Generated Tests:', tests);
    } catch (err) {
      console.error('Test generation failed:', err);
    }
  };

  return (
    <button onClick={() => handleGenerateTests(contractCode)} disabled={loading}>
      {loading ? 'Generating...' : 'Generate Tests'}
    </button>
  );
}
```

### 7. `useCortensorComplete` - All-in-One Hook

Combines all Cortensor functionality in a single hook.

```typescript
import { useCortensorComplete } from '@/hooks/useCortensor';

function CompleteAIBuilder() {
  const cortensor = useCortensorComplete({
    chainId: 421614,
    autoInitialize: true
  });

  const {
    // Main SDK state
    isInitialized,
    isReady,
    isHealthy,
    loading,
    error,
    
    // Individual AI functionalities
    ai,                    // useCortensorAI
    contractGeneration,    // useCortensorContractGeneration
    securityAnalysis,      // useCortensorSecurityAnalysis
    documentation,         // useCortensorDocumentation
    testGeneration         // useCortensorTestGeneration
  } = cortensor;

  return (
    <div>
      <p>SDK Status: {isHealthy ? 'Online' : 'Offline'}</p>
      
      <button 
        onClick={() => contractGeneration.generateContract("Create ERC20", "ERC20")}
        disabled={contractGeneration.loading}
      >
        Generate Contract
      </button>
      
      <button 
        onClick={() => securityAnalysis.analyzeContract(code, "Arbitrum")}
        disabled={securityAnalysis.loading}
      >
        Analyze Security
      </button>
    </div>
  );
}
```

## Environment Configuration

The SDK requires proper environment variables to connect to deployed Cortensor contracts:

```env
# .env.local
NEXT_PUBLIC_CORTENSOR_SESSION_CONTRACT=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_CORTENSOR_SESSION_QUEUE_CONTRACT=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_EXPECTED_CHAIN_ID=421614
NEXT_PUBLIC_TARGET_NETWORK=arbitrum-sepolia
```

## Mock Mode

When contracts are not configured or not available, the SDK automatically falls back to mock mode, providing realistic sample responses for development:

```typescript
// Mock responses are generated when:
// 1. Contract addresses are not configured
// 2. Contracts are not deployed
// 3. Network connectivity issues
// 4. ABI mismatches

const result = await callAI({
  messages: [
    { role: "user", content: "Create an ERC20 token" }
  ]
});
// Returns mock smart contract code for development
```

## Error Handling

All hooks provide error states and handle failures gracefully:

```typescript
function RobustComponent() {
  const { generateContract, loading, error } = useCortensorContractGeneration();

  const handleGenerate = async () => {
    try {
      const result = await generateContract(prompt, type);
      // Handle success
    } catch (err) {
      // Error is automatically captured in the error state
      console.error('Generation failed:', error);
    }
  };

  return (
    <div>
      {error && (
        <div className="error">
          Error: {error}
        </div>
      )}
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Loading...' : 'Generate'}
      </button>
    </div>
  );
}
```

## Integration with Existing wagmi Setup

The hooks work seamlessly with existing wagmi configuration:

```typescript
// In your app setup
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi-config';

function App() {
  return (
    <WagmiProvider config={config}>
      <YourComponents />
    </WagmiProvider>
  );
}

// In your components
function Component() {
  // These hooks automatically use the wagmi context
  const cortensor = useCortensor();
  
  // Wallet connection state is handled automatically
  useEffect(() => {
    if (cortensor.isHealthy) {
      console.log('Cortensor is ready for AI calls!');
    }
  }, [cortensor.isHealthy]);
}
```

## Migration Guide

### From Direct ethers.js Usage

**Before:**
```typescript
import { ethers } from 'ethers';
import { initializeCortensorSDK, callCortensorAI } from '@/utils/Cortensor';

// Manual provider setup
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
initializeCortensorSDK(signer);

// Direct function calls
const result = await callCortensorAI({
  messages: [{ role: "user", content: "Create ERC20" }]
});
```

**After:**
```typescript
import { useCortensorAI } from '@/hooks/useCortensor';

function Component() {
  const { callAI, loading, error } = useCortensorAI();
  
  const handleCall = async () => {
    const result = await callAI({
      messages: [{ role: "user", content: "Create ERC20" }]
    });
  };
}
```

### From Legacy Mistral Integration

If you were using Mistral AI functions, the migration is straightforward:

**Before:**
```typescript
import { callMistralAI, generateSmartContract } from '@/utils/mistralAI';

const contract = await generateSmartContract(prompt, type);
```

**After:**
```typescript
import { useCortensorContractGeneration } from '@/hooks/useCortensor';

function Component() {
  const { generateContract } = useCortensorContractGeneration();
  
  const contract = await generateContract(prompt, type);
}
```

## Best Practices

1. **Use the complete hook for complex components:**
   ```typescript
   const cortensor = useCortensorComplete(); // All functionality
   ```

2. **Use individual hooks for focused components:**
   ```typescript
   const { generateContract } = useCortensorContractGeneration(); // Just generation
   ```

3. **Handle loading and error states:**
   ```typescript
   if (loading) return <Spinner />;
   if (error) return <ErrorMessage error={error} />;
   ```

4. **Check SDK health before making calls:**
   ```typescript
   useEffect(() => {
     if (cortensor.isHealthy) {
       // Safe to make AI calls
     } else if (cortensor.isReady) {
       // Mock mode - still functional for development
     }
   }, [cortensor.isHealthy, cortensor.isReady]);
   ```

5. **Use environment-based configuration:**
   ```typescript
   const cortensor = useCortensor({
     chainId: process.env.NODE_ENV === 'development' ? 421614 : 42161,
     autoInitialize: true
   });
   ```

This integration provides a more React-friendly, type-safe, and maintainable way to use the Cortensor Web3 SDK in your applications.
