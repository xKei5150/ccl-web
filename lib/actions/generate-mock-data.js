'use server'

import { generateMockData } from '../mock-data-generator'

// Helper to log key details for debugging
function logDetails(message, data = {}) {
  console.log(`[MOCK-DATA-ACTION] ${message}`, data);
}

export async function generateMockDataAction(count = 50) {
  logDetails(`Starting mock data generation action with count=${count}`);
  
  try {
    // Set a reasonable timeout for the operation
    const timeout = 240000; // 4 minutes
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Generation timed out after 4 minutes')), timeout)
    );
    
    // Race the actual operation against the timeout
    logDetails('Initiating mock data generation with timeout');
    const result = await Promise.race([
      generateMockData(count, {generateUsersFlag: false, collectionsToGenerate: ['demographics']}),
      timeoutPromise
    ]);
    
    logDetails('Mock data generation completed successfully', { stats: result.stats });
    
    return {
      success: true,
      message: `Successfully generated Filipino mock data using Gemini AI`,
      stats: {
        ...result.stats,
        timestamp: new Date().toISOString(),
        recordsPerCollection: count
      }
    };
  } catch (error) {
    logDetails('Error in generate mock data action:', { 
      message: error.message,
      stack: error.stack 
    });
    
    // Determine the type of error
    let errorType = 'GENERATION_ERROR';
    let errorMessage = error.message;
    let recoveryOption = null;
    
    if (errorMessage.includes('GEMINI_API_KEY') || errorMessage.includes('generative')) {
      errorType = 'API_KEY_ERROR';
      errorMessage = 'Gemini AI API key error: ' + errorMessage;
      recoveryOption = 'Check your NEXT_PUBLIC_GEMINI_API_KEY environment variable.';
    } else if (errorMessage.includes('parse') || errorMessage.includes('JSON') || errorMessage.includes('double-quoted')) {
      errorType = 'JSON_PARSE_ERROR';
      errorMessage = 'Error parsing AI response: ' + errorMessage;
      recoveryOption = 'Try again with a smaller number of records (e.g., 20 instead of 50).';
    } else if (errorMessage.includes('timeout')) {
      errorType = 'TIMEOUT_ERROR';
      recoveryOption = 'Try again with a smaller number of records or check your internet connection.';
    }
    
    return { 
      success: false, 
      error: errorMessage,
      errorType,
      errorDetail: error.stack,
      timestamp: new Date().toISOString(),
      recovery: recoveryOption
    };
  }
}