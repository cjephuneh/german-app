import Constants from 'expo-constants';

// Get 11Labs credentials from environment variables
const apiKey = Constants.expoConfig?.extra?.elevenLabsApiKey as string;
const voiceId = Constants.expoConfig?.extra?.elevenLabsVoiceId as string;

// Base URL for 11Labs API
const API_BASE_URL = 'https://api.elevenlabs.io/v1';

/**
 * Generate speech from text using 11Labs API
 * @param text The text to convert to speech
 * @returns A promise that resolves to the audio URL
 */
export async function generateSpeech(text: string): Promise<string> {
  try {
    if (!apiKey || !voiceId) {
      console.error('11Labs credentials are missing. Please check your environment variables.');
      throw new Error('11Labs credentials are missing');
    }

    const response = await fetch(`${API_BASE_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`11Labs API error: ${errorData.detail || response.statusText}`);
    }

    // In a real app, you would save this audio blob to a file or storage service
    // For this example, we'll just return a placeholder URL
    // The actual implementation would convert the response to a blob and save it
    
    // Simulated response for demo purposes
    return 'https://example.com/audio.mp3';
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}