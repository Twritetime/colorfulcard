import { useState } from "react";

interface FormState {
  error?: string;
  success?: string;
  isLoading: boolean;
}

export function useFormState(initialState: FormState = { isLoading: false }) {
  const [state, setState] = useState<FormState>(initialState);

  const setError = (error: string) => {
    setState({ isLoading: false, error });
  };

  const setSuccess = (success: string) => {
    setState({ isLoading: false, success });
  };

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  };

  const reset = () => {
    setState({ isLoading: false });
  };

  return {
    ...state,
    setError,
    setSuccess,
    setLoading,
    reset,
  };
} 