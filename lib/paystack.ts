import Constants from 'expo-constants';

// Get Paystack credentials from environment variables
const publicKey = Constants.expoConfig?.extra?.paystackPublicKey as string;

/**
 * Initialize a Paystack transaction
 * @param email Customer's email address
 * @param amount Amount to charge in the smallest currency unit (e.g., kobo for NGN)
 * @param currency Currency code (e.g., NGN, USD)
 * @returns A promise that resolves to the transaction initialization response
 */
export async function initializeTransaction(
  email: string,
  amount: number,
  currency: string = 'NGN'
): Promise<any> {
  try {
    if (!publicKey) {
      console.error('Paystack public key is missing. Please check your environment variables.');
      throw new Error('Paystack public key is missing');
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicKey}`,
      },
      body: JSON.stringify({
        email,
        amount,
        currency,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Paystack API error: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error initializing Paystack transaction:', error);
    throw error;
  }
}

/**
 * Verify a Paystack transaction
 * @param reference Transaction reference
 * @returns A promise that resolves to the transaction verification response
 */
export async function verifyTransaction(reference: string): Promise<any> {
  try {
    if (!publicKey) {
      console.error('Paystack public key is missing. Please check your environment variables.');
      throw new Error('Paystack public key is missing');
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicKey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Paystack API error: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying Paystack transaction:', error);
    throw error;
  }
}