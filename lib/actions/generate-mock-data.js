'use server'

import { generateMockData } from '../mock-data-generator'

export async function generateMockDataAction() {
  try {
    const result = await generateMockData(50)
    return result
  } catch (error) {
    console.error('Error in generate mock data action:', error)
    return { success: false, error: error.message }
  }
}