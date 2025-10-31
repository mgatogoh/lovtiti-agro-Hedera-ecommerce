// Clerk configuration for Lovtiti Agro Mart
import { ClerkProvider } from '@clerk/nextjs';

export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  appearance: {
    baseTheme: undefined,
    variables: {
      colorPrimary: '#16a34a', // green-600
      colorBackground: '#f9fafb', // gray-50
      colorText: '#111827', // gray-900
      colorTextSecondary: '#6b7280', // gray-500
      borderRadius: '0.5rem', // rounded-lg
    },
    elements: {
      formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white',
      card: 'shadow-lg border border-gray-200',
      headerTitle: 'text-green-600 font-bold',
      headerSubtitle: 'text-gray-600',
      socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
      socialButtonsBlockButtonText: 'text-gray-700',
      formFieldInput: 'border border-gray-300 focus:border-green-500 focus:ring-green-500',
      footerActionLink: 'text-green-600 hover:text-green-700',
    },
  },
  localization: {
    locale: 'en',
  },
  // Suppress development warnings in console
  __clerk_ssr_interstitial_html: `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background-color: #f9fafb;">
      <div style="text-align: center; padding: 2rem;">
        <div style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #16a34a; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p style="color: #6b7280; font-size: 0.875rem;">Loading Lovtiti Agro Mart...</p>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `,
};

// Suppress Clerk development warnings
if (typeof window !== 'undefined') {
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;
  
  console.warn = (...args: any[]) => {
    const message = String(args[0] || '');
    
    // Suppress Clerk development warnings
    if (
      message.includes('Clerk has been loaded with development keys') ||
      message.includes('Development instances have strict usage limits') ||
      message.includes('should not be used when deploying your application to production')
    ) {
      // Optionally log a cleaner message
      console.info('🔧 Clerk: Using development keys (this is normal for local development)');
      return;
    }
    
    originalConsoleWarn.apply(console, args);
  };
  
  console.error = (...args: any[]) => {
    const message = String(args[0] || '');
    
    // Suppress hydration warnings
    if (
      message.includes('Warning: Extra attributes from the server') ||
      message.includes('cz-shortcut-listen')
    ) {
      return;
    }
    
    originalConsoleError.apply(console, args);
  };
}







