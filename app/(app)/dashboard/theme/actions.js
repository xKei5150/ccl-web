"use server";

import { payload } from "@/lib/payload";
import { revalidatePath } from "next/cache";

export async function updateThemeSettings(data) {
  try {
    // Remove any keys that aren't theme color properties
    const { id, ...themeData } = data;
    
    // Update the theme settings global in PayloadCMS
    const result = await payload.updateGlobal({
      slug: 'theme-settings',
      data: themeData,
    });
    
    // Revalidate theme-related paths to ensure changes are visible
    revalidatePath('/dashboard/theme');
    revalidatePath('/dashboard');
    
    return { 
      success: true, 
      data: result 
    };
  } catch (error) {
    console.error('Error updating theme settings:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to update theme settings' 
    };
  }
} 