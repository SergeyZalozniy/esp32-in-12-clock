export interface WiFiState {
  selectedNetwork: string | null;
  isManualEntry: boolean;
  password: string;
  isPasswordValid: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  isPasswordVisible: boolean;
  isPasswordTouched: boolean;
  validationError: string | null;
  isDropdownOpen: boolean;
}
