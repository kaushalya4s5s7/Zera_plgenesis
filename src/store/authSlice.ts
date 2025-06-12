import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  address: string | null;
  isConnectednormal: boolean;
  isConnecting: boolean;
  error: string | null;
}

const initialState: WalletState = {
  address: null,
  isConnectednormal: false,
  isConnecting: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connectWallet: (state) => {
      state.isConnecting = true;
      state.error = null;
    },
    connectWalletSuccess: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
      state.isConnectednormal = true;
      state.isConnecting = false;
      state.error = null;
    },
    connectWalletFailure: (state, action: PayloadAction<string>) => {
      state.isConnecting = false;
      state.error = action.payload;
    },
    disconnectWallet: (state) => {
      state.address = null;
      state.isConnectednormal = false;
      state.isConnecting = false;
      state.error = null;
    },
  },
});

export const {
  connectWallet,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
