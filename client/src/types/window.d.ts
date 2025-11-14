// src/types/window.d.ts
interface PaystackConfig {
    email: string;
    phone: string;
    amount: number; // KES (will be *100 in script)
    recipeId: string | number;
    recipeName: string;
    metadata?: Record<string, any>;
    onSuccess: (downloadUrl: string) => void;
    onClose: () => void;
  }
  
  interface PaystackCartConfig {
    email: string;
    phone: string;
    items: Array<{
      recipeId: string | number;
      recipeName: string;
      amount: number; // KES
    }>;
    onSuccess: (downloadUrls: string[], finalAmount: number, discount: number) => void;
    onClose: () => void;
  }
  
  interface Window {
    payWithPaystack: (config: PaystackConfig) => void;
    payWithPaystackCart: (config: PaystackCartConfig) => void;
  }