interface SlugParams {
    value?: string;
    data?: Record<string, any>;
    originalDoc?: Record<string, any>;
}

export function generateSlug(fieldName: string) {
    return ({ value, data, originalDoc }: SlugParams): string => {
        // If we have a value from the field, use that, otherwise use the source field
        const source = value || (data && data[fieldName]) || '';
        
        if (!source) return '';
        
        // Generate URL-friendly slug
        const slug = source
            .toLowerCase()
            .normalize('NFD') // Normalize unicode characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .trim() // Remove whitespace from both ends
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
        
        return slug;
    };
}