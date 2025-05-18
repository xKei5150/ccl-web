import { model, createStructuredModel, personalInfoSchema } from '@/lib/genAI';
import { payload } from '@/lib/payload';
import { headers } from 'next/headers';
import { schemas } from '@/lib/schemas';

// Helper function to sanitize potential JSON issues from AI responses
function sanitizeJsonString(jsonString) {
  // Fix unquoted property names (common AI generation error)
  const propertyNameFix = jsonString.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
  
  // Fix single-quoted strings to double-quoted strings
  const singleQuoteFix = propertyNameFix.replace(/([{,]\s*")([^"]+)(":\s*)'([^']+)'/g, '$1$2$3"$4"');
  
  // Fix trailing commas in objects and arrays
  const trailingCommaFix = singleQuoteFix
    .replace(/,\s*}/g, '}')
    .replace(/,\s*\]/g, ']');
  
  // Handle possible JS-style comments
  const commentFix = trailingCommaFix
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  
  return commentFix;
}

// Add new utility functions for date and address management
// Function to get dates distributed across demographic years
function getDistributedDate(demographicYears, options = {}) {
  const {
    favorRecentMonths = false,
    maxPastYears = 5,
    maxFutureMonths = 3
  } = options;
  
  // If demographic years are provided, use them
  if (demographicYears && demographicYears.length > 0) {
    // Pick a random year from demographic years
    const year = demographicYears[Math.floor(Math.random() * demographicYears.length)];
    
    // Generate a random month (1-12)
    const month = Math.floor(Math.random() * 12) + 1;
    
    // Generate a random day (1-28 to avoid month-end issues)
    const day = Math.floor(Math.random() * 28) + 1;
    
    // Create the date
    return new Date(year, month - 1, day).toISOString();
  } else {
    // Fallback to current year with random distribution
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Determine year range
    const minYear = currentYear - maxPastYears;
    const years = [];
    for (let y = minYear; y <= currentYear; y++) {
      years.push(y);
    }
    
    // Select a random year with bias toward more recent years if requested
    let year;
    if (favorRecentMonths) {
      // Higher chance for recent years
      const yearBias = Math.random();
      if (yearBias < 0.6) {
        year = currentYear;
      } else if (yearBias < 0.8) {
        year = currentYear - 1;
      } else {
        year = years[Math.floor(Math.random() * years.length)];
      }
    } else {
      // Equal distribution
      year = years[Math.floor(Math.random() * years.length)];
    }
    
    // Determine month range
    let monthRange;
    if (year < currentYear) {
      // Full month range for past years
      monthRange = 12;
    } else {
      // For current year, limit to current month plus allowed future months
      monthRange = Math.min(now.getMonth() + 1 + maxFutureMonths, 12);
    }
    
    // Select a random month
    let month;
    if (favorRecentMonths && year === currentYear) {
      // Higher chance for recent months in current year
      const monthBias = Math.random();
      if (monthBias < 0.7) {
        // Current month or recent past months
        month = Math.max(1, now.getMonth() - Math.floor(Math.random() * 3) + 1);
      } else {
        // Any valid month
        month = Math.floor(Math.random() * monthRange) + 1;
      }
    } else {
      // Random month within range
      month = Math.floor(Math.random() * monthRange) + 1;
    }
    
    // Generate a random day (1-28 to avoid month-end issues)
    const day = Math.floor(Math.random() * 28) + 1;
    
    // Create the date
    return new Date(year, month - 1, day).toISOString();
  }
}

// Enhanced address management with unique house numbers
const addressRegistry = {
  // Map to track used house numbers per street
  usedHouseNumbers: {},
  
  // Map to track household-address associations
  householdAddresses: {},
  
  // Base addresses without house numbers
  baseAddresses: [
    "Sampaguita St., Purok 1, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Orchid Ave., Purok 2, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Jasmine Rd., Purok 3, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Ilang-Ilang Lane, Purok 1, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Rosal St., Purok 4, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Dahlia Rd., Sitio Matahimik, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Gumamela Ave., Purok 5, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Camia St., Sitio Maunlad, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Bougainvillea Rd., Purok 2, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Santan Lane, Purok 3, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Acacia St., Sitio Maganda, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Narra Ave., Purok 4, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Mahogany Rd., Sitio Malinis, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Ipil-Ipil St., Purok 5, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Molave Ave., Purok 1, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Yakal Rd., Sitio Maayos, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Kalayaan St., Purok 3, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Rizal Ave., Sitio Progreso, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Bonifacio St., Purok 4, Brgy. Malabanban Norte, Candelaria, Quezon",
    "Mabini Rd., Purok 2, Brgy. Malabanban Norte, Candelaria, Quezon"
  ],
  
  // Generate a unique house number for a street
  generateUniqueHouseNumber(street) {
    if (!this.usedHouseNumbers[street]) {
      this.usedHouseNumbers[street] = new Set();
    }
    
    // Try to find a unique number (between 1-300)
    let houseNumber;
    do {
      houseNumber = Math.floor(Math.random() * 300) + 1;
    } while (this.usedHouseNumbers[street].has(houseNumber));
    
    // Record this house number as used
    this.usedHouseNumbers[street].add(houseNumber);
    
    return houseNumber;
  },
  
  // Get a unique address
  getUniqueAddress() {
    // Pick a random street
    const baseAddress = this.baseAddresses[Math.floor(Math.random() * this.baseAddresses.length)];
    
    // Get unique house number for this street
    const houseNumber = this.generateUniqueHouseNumber(baseAddress);
    
    // Return full address
    return `${houseNumber} ${baseAddress}`;
  },
  
  // Get or create an address for a household
  getHouseholdAddress(householdId) {
    // If this household already has an address, return it
    if (this.householdAddresses[householdId]) {
      return this.householdAddresses[householdId];
    }
    
    // Otherwise, create a new unique address
    const address = this.getUniqueAddress();
    this.householdAddresses[householdId] = address;
    
    return address;
  },
  
  // Get address for a person based on household (if available) or generate a new one
  getAddressForPerson(personId, householdId = null) {
    if (householdId) {
      return this.getHouseholdAddress(householdId);
    } else {
      return this.getUniqueAddress();
    }
  }
};

// Replace the existing getMalabanbanNorteAddress function with the enhanced version
function getMalabanbanNorteAddress() {
  return addressRegistry.getUniqueAddress();
}

// Function to safely parse JSON with fallback and error recovery
function safeJsonParse(jsonString, context = 'unknown') {
  // First try to parse directly
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn(`JSON parse error in ${context}. Attempting to sanitize...`);
    
    // Try to sanitize and parse
    try {
      const sanitized = sanitizeJsonString(jsonString);
      return JSON.parse(sanitized);
    } catch (sanitizedError) {
      // Last resort: Try to extract a JSON structure
      try {
        // Look for outermost object or array pattern
        const fullJsonMatch = jsonString.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (fullJsonMatch) {
          const extracted = sanitizeJsonString(fullJsonMatch[0]);
          return JSON.parse(extracted);
        }
      } catch (extractionError) {
        // Give up and throw original error
        console.error(`Failed all JSON parsing attempts for ${context}`);
      }
      throw error; // Throw original error if all attempts fail
    }
  }
}

// Helper to sanitize strings for embedding in prompts
function sanitizeForPrompt(text) {
  if (typeof text !== 'string') return '';
  // Remove problematic characters for AI prompts (quotes, newlines) and limit length.
  // Keeping it simple and alphanumeric-like is usually safer for AI.
  let cleanedText = text.replace(/['"‘'“"']/g, ''); // Remove various quotes and backticks
  cleanedText = cleanedText.replace(/[^\w\s.,-]/g, ''); // Remove most non-alphanumeric, non-space, non-basic-punctuation
  cleanedText = cleanedText.replace(/\s+/g, ' ').trim(); // Normalize spaces
  return cleanedText.substring(0, 75); // Limit length for safety in prompt
}

// Set up console logger for better debugging
const logger = {
  info: (message, data = {}) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    if (error?.stack) {
      console.error(error.stack);
    }
  },
  debug: (message, data = {}) => {
    console.log(`[DEBUG] ${message}`, data);
  },
  warn: (message, data = {}) => {
    console.log(`[WARN] ${message}`, data);
  }
};

// Utility to get user IDs (either generated or fetched)
async function getUserIds(count, personalInfoIds, shouldGenerateUsers) {
  if (shouldGenerateUsers) {
    // Generate new users with linked personal info
    logger.info("Beginning user generation with linked personal information");
    
    // First, fetch the personal info records to get the names for email generation
    const personalInfoRecords = [];
    if (personalInfoIds && personalInfoIds.length > 0) {
      for (const id of personalInfoIds.slice(0, count)) {
        try {
          const person = await payload.findByID({
            collection: 'personal-information',
            id
          });
          personalInfoRecords.push(person);
        } catch (error) {
          logger.error(`Failed to fetch personal info with ID ${id}`, error);
        }
      }
      logger.info(`Fetched ${personalInfoRecords.length} personal info records for user creation`);
    }
    
    const userIds = await generateUsers(count, personalInfoIds, personalInfoRecords);
    logger.info(`Generated ${userIds.length} user records with matched personal info`);
    return userIds;
  } else if (providedUserIds && providedUserIds.length > 0) {
    // Use provided IDs (likely personalInfoIds linked to existing users or specific selection)
    logger.info("Using provided IDs for user context, linking to existing users if possible");
    // Find users linked to the provided personalInfoIds
    const { docs: existingUsers } = await payload.find({
      collection: 'users',
      where: {
        personalInfo: { in: providedUserIds }
      },
      limit: count * 2, // Fetch more to ensure coverage
      depth: 0 // No need for deep population
    });
    const userIds = existingUsers.map(u => u.id);
    logger.info(`Found ${userIds.length} existing users linked to provided personalInfoIds.`);
    if (userIds.length === 0) {
      logger.warn("No existing users found linked to provided IDs. Attempting to fetch random users.");
      return await getRandomUserIds(count);
    }
    return userIds;
  } else {
    // Fetch random existing users if no specific IDs are provided and generation is skipped
    logger.info("User generation skipped and no specific IDs provided. Fetching random existing user IDs.");
    return await getRandomUserIds(count);
  }
}

// Helper to fetch random user IDs
async function getRandomUserIds(count) {
  try {
    const { docs: users, totalDocs } = await payload.find({
      collection: 'users',
      limit: count * 2, // Fetch a bit more for randomness
      depth: 0
    });

    if (totalDocs === 0) {
      logger.error("No existing users found in the database. Cannot assign creators/authors.");
      return []; // Return empty if no users exist
    }

    // Select random users up to the required count
    const randomUserIds = users
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, count) // Take required count
      .map(u => u.id);

    logger.info(`Fetched ${randomUserIds.length} random user IDs from ${totalDocs} total users.`);
    return randomUserIds;
  } catch (error) {
    logger.error("Failed to fetch random user IDs", error);
    return []; // Return empty on error
  }
}

/**
 * Wraps an async function with a timeout, falling back to an alternative if the timeout is exceeded
 * @param {Function} asyncFn - The async function to execute
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {Function} fallbackFn - Function to execute if timeout is reached
 * @param {string} operationName - Name of the operation for logging
 * @returns {Promise<any>} - The result of asyncFn or fallbackFn
 */
async function withTimeout(asyncFn, timeoutMs = 10000, fallbackFn, operationName = 'operation') {
  return new Promise(async (resolve) => {
    let isResolved = false;
    
    // Set timeout
    const timeoutId = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        logger.warn(`Timeout of ${timeoutMs}ms exceeded for ${operationName}, using fallback`);
        resolve(fallbackFn());
      }
    }, timeoutMs);
    
    try {
      // Execute the async function
      const result = await asyncFn();
      
      // If not timed out yet, resolve with the result
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeoutId);
        resolve(result);
      }
    } catch (error) {
      // If not timed out yet but there was an error, use fallback
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeoutId);
        logger.error(`Error in ${operationName}, using fallback`, error);
        resolve(fallbackFn());
      }
    }
  });
}

// First, add a timeout utility function at the top of the file
/**
 * Execute an async function with a timeout
 * @param {Promise} promise - The promise to execute
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {string} operationName - Name of operation for logging
 * @returns {Promise} - Resolves with the result or rejects with timeout error
 */
async function executeWithTimeout(promise, timeoutMs, operationName = 'operation') {
  let timeoutId;
  
  // Create a timeout promise that rejects after specified time
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout of ${timeoutMs}ms exceeded for ${operationName}`));
    }, timeoutMs);
  });
  
  try {
    // Race the original promise against the timeout
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function generateMockData(count = 50, options = {}) {
  const { 
    generateUsersFlag = true, // Default to generating users
    collectionsToGenerate = null, // Default to all, null means generate all
    useConsistentDates = true, // Whether to use demographic years for consistent date ranges
    householdPriority = 0.1 // Proportion of people to prioritize for households (0.0-1.0)
  } = options;

  const shouldGenerate = (collectionSlug) => 
    !collectionsToGenerate || collectionsToGenerate.includes(collectionSlug);

  logger.info(`Starting mock data generation for ${count} records per collection`, { 
    generateUsersFlag, 
    collectionsToGenerate,
    householdPriority
  });
  
  const stats = {};
  let personalInfoIds = [];
  let userIds = [];
  let financingIds = [];
  let demographicYears = [];

  try {
    // Set an explicit log marker to trace execution flow
    logger.info("=== MOCK DATA GENERATION STARTING ===");
    logger.info(`Request: Generate ${count} records per collection, options: ${JSON.stringify(options)}`);
    
    // Fetch existing demographic years for date distribution if needed
    if (useConsistentDates) {
      try {
        logger.info("Fetching existing demographic years for date distribution");
        const { docs: existingDemographics } = await payload.find({
          collection: 'demographics',
          limit: 100,
          depth: 0
        });
        
        if (existingDemographics.length > 0) {
          demographicYears = existingDemographics.map(d => d.year).sort((a, b) => b - a); // Sort descending
          logger.info(`Found ${demographicYears.length} demographic years: ${demographicYears.join(', ')}`);
        } else {
          logger.info("No existing demographic years found, will generate dates normally");
        }
      } catch (error) {
        logger.error("Failed to fetch demographic years", error);
      }
    }

    // Calculate number of households to create
    // We want to ensure we create enough households for our target household priority
    let householdCount = Math.floor(count / 3);
    
    if (householdPriority > 0.5) {
      // Increase household count if we want higher household coverage
      householdCount = Math.floor(count / 2);
    }
    
    // Personal information generation comes first
    if (shouldGenerate('personal-information')) {
      logger.info("Beginning personal information generation");
      personalInfoIds = await generatePersonalInformation(count, demographicYears);
      logger.info(`Generated ${personalInfoIds.length} personal information records`);
      stats.personalInfo = personalInfoIds.length;
    } else {
      logger.info("Skipping personal information generation based on options.");
      // Fetch existing personal info if needed for relationships later
      const { docs: existingPersonalInfo } = await payload.find({ collection: 'personal-information', limit: count * 2, depth: 0 });
      personalInfoIds = existingPersonalInfo.map(p => p.id);
      logger.info(`Using ${personalInfoIds.length} existing personal information IDs.`);
    }
    
    // Generate Households immediately after Personal Info to maximize groupings
    if (shouldGenerate('households') && personalInfoIds.length > 0) {
      logger.info("Beginning household generation");
      const householdsCount = await generateHouseholds(householdCount, personalInfoIds, demographicYears);
      logger.info(`Generated ${householdsCount} household records`);
      stats.households = householdsCount;
    } else {
      logger.info(`Skipping households generation ${personalInfoIds.length === 0 ? ' (no personal info IDs available)' : 'based on options'}.`);
    }
    
    // Generate or fetch Users 
    if (shouldGenerate('users') || generateUsersFlag) { // Generate if explicitly requested OR flag is true
      // Pass personalInfoIds to link users if available
      userIds = await getUserIds(count, personalInfoIds, true);
      stats.users = userIds.length;
    } else {
      logger.info("Skipping user generation based on options.");
      // Fetch existing user IDs if needed for relationships
      userIds = await getRandomUserIds(count * 5); // Fetch more IDs for broader random assignment
      logger.info(`Using ${userIds.length} existing user IDs for assignments.`);
      stats.users = 0; // Indicate 0 *new* users generated
    }
    
    // Generate Demographics (moved earlier to ensure years are available)
    if (shouldGenerate('demographics')) {
        logger.info("Beginning demographics generation");
        // const demographicsCount = await generateDemographics(Math.floor(count / 10), userIds); // Generate fewer demographic entries (e.g., per year)
        const desiredDemographicYearCount = 6; // For 2020-2025 range if current year is 2025
        logger.info(`Attempting to generate ${desiredDemographicYearCount} demographic records (e.g., for 2020-2025 range).`);
        const demographicsCount = await generateDemographics(desiredDemographicYearCount, userIds);
        logger.info(`Generated ${demographicsCount} demographic records`);
        stats.demographics = demographicsCount;
        
        // Refresh demographic years after generation
        if (useConsistentDates) {
          try {
            const { docs: newDemographics } = await payload.find({
              collection: 'demographics',
              limit: 100,
              depth: 0
            });
            demographicYears = newDemographics.map(d => d.year).sort((a, b) => b - a);
            logger.info(`Updated demographic years after generation: ${demographicYears.join(', ')}`);
          } catch (error) {
            logger.error("Failed to refresh demographic years", error);
          }
        }
    } else {
        logger.info("Skipping demographics generation based on options.");
    }
    
    // Generate Financing records (needed for Projects relationship)
    if (shouldGenerate('financing')) {
      logger.info("Beginning financing generation");
      const financingResult = await generateFinancing(Math.floor(count / 2), userIds, demographicYears);
      financingIds = financingResult.financingIds;
      stats.financing = financingResult.financingCreated;
      stats.financingAuditLog = financingResult.auditLogsCreated;
      logger.info(`Generated ${stats.financing} financing records and ${stats.financingAuditLog} audit logs`);
    } else {
        logger.info("Skipping financing generation based on options.");
        // Fetch existing financing IDs if needed for projects
        try {
          const { docs: existingFinancing } = await payload.find({ 
            collection: 'financing', 
            limit: count * 2, // Fetch more to ensure we have enough
            depth: 0 
          });
          financingIds = existingFinancing.map(f => f.id).filter(id => id); // Ensure valid IDs only
          logger.info(`Using ${financingIds.length} existing financing IDs: ${financingIds.slice(0, 5).join(', ')}${financingIds.length > 5 ? '...' : ''}`);
        } catch (error) {
          logger.error("Failed to fetch existing financing IDs", error);
          financingIds = []; // Empty array as fallback
        }
    }

    // Generate Posts
    if (shouldGenerate('posts')) {
      logger.info("Beginning post generation");
      const postsCount = await generatePosts(count, userIds, demographicYears);
      logger.info(`Generated ${postsCount} post records`);
      stats.posts = postsCount;
    } else {
      logger.info("Skipping posts generation based on options.");
    }
    
    // Generate Businesses & Permits
    if (shouldGenerate('business')) {
      logger.info("Beginning business generation");
      const businessResult = await generateBusinesses(count, demographicYears);
      stats.businesses = businessResult.businessesCreated;
      stats.businessPermits = businessResult.permitsCreated;
      logger.info(`Generated ${stats.businesses} business records and ${stats.businessPermits} permits`);
    } else {
      logger.info("Skipping business generation based on options.");
    }
    
    // Generate Reports
    if (shouldGenerate('reports')) {
      logger.info("Beginning report generation");
      const reportsCount = await generateReports(count, userIds, demographicYears); // Pass userIds for submitter
      logger.info(`Generated ${reportsCount} report records`);
      stats.reports = reportsCount;
    } else {
      logger.info("Skipping report generation based on options.");
    }
    
    // Generate Requests
    if (shouldGenerate('requests') && personalInfoIds.length > 0) {
      logger.info("Beginning request generation");
      const requestsCount = await generateRequests(count, personalInfoIds, demographicYears);
      logger.info(`Generated ${requestsCount} request records`);
      stats.requests = requestsCount;
    } else {
      logger.info(`Skipping requests generation ${personalInfoIds.length === 0 ? ' (no personal info IDs available)' : 'based on options'}.`);
    }

    // Generate Projects
    if (shouldGenerate('projects')) {
        logger.info("Beginning project generation");
        const projectsCount = await generateProjects(count, userIds, financingIds, demographicYears);
        logger.info(`Generated ${projectsCount} project records`);
        stats.projects = projectsCount;
    } else {
        logger.info("Skipping project generation based on options.");
    }
    
    logger.info("=== MOCK DATA GENERATION COMPLETED ===");
    logger.info(`Generated data summary: ${JSON.stringify(stats)}`);
    
    return { 
      success: true, 
      message: 'Mock data generation process completed.',
      stats: stats
    };
  } catch (error) {
    logger.error('Error generating mock data:', error);
    return { success: false, error: error.message, stack: error.stack };
  }
}

async function generatePersonalInformation(count, demographicYears = []) {
  const generatedIds = [];
  const householdReadyPersons = []; // Track IDs of persons suitable for household membership
  
  try {
    logger.info(`Generating ${count} Filipino personal information records in Brgy. Malabanban Norte`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.personalInfo;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);
    
    const prompt = `Generate ${count} Filipino personal information records for a database.
    
    Requirements:
    - Use Filipino naming conventions (firstName, middleName, lastName)
    - Include email address formats typical for Filipinos
    - IMPORTANT: Email address must use the field name "email_address" (with underscore) not "emailAddress"
    - All addresses must be in Brgy. Malabanban Norte, Candelaria, Quezon (I will replace these with specific addresses later)
    - Sex should be male, female, or other
    - Birth dates should range from 1950 to 2005
    - Marital status should vary among single, married, divorced, and widowed
    - Set residencyStatus as either 'permanent' or 'temporary'
    - Set lifeStatus as 'alive' for all records
    - For approximately 80% of records, include a field 'householdMembership' as true to indicate potential for household inclusion
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: sanitizeForPrompt(prompt) });
    
    // Make the API call with structured output
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = result.response;
    logger.debug("Received response from Gemini API");
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let personalInfoData;
    try {
      personalInfoData = safeJsonParse(data, 'personalInfoData');
      logger.debug("Successfully parsed JSON response");
      
      // Verify we have the records array
      if (!personalInfoData.records || !Array.isArray(personalInfoData.records)) {
        // Try one more fallback approach - look for an array directly
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'personalInfoArrayFallback');
          if (Array.isArray(arrayData)) {
            personalInfoData = { records: arrayData };
            logger.debug("Used fallback array extraction", { count: arrayData.length });
          }
        }
        
        if (!personalInfoData.records || !Array.isArray(personalInfoData.records)) {
          throw new Error("Response missing records array");
        }
      }
      logger.info(`Parsed ${personalInfoData.records.length} personal info records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response", { 
        rawData: data,
        rawSegment: data.substring(25280, 25300) // Show problematic segment
      });
      throw new Error(`Failed to parse structured output: ${error.message}`);
    }
    
    // Create family units for more realistic household grouping
    const familyGroups = [];
    const familyLastNames = new Set();
    
    // First pass: identify common last names to create family groups
    personalInfoData.records.forEach(person => {
      if (person.name && person.name.lastName) {
        familyLastNames.add(person.name.lastName);
      }
    });
    
    // Convert to array and shuffle
    const availableFamilyNames = Array.from(familyLastNames).sort(() => 0.5 - Math.random());
    
    // Select some family names for household grouping (about 60% of them)
    const householdFamilyNames = availableFamilyNames.slice(0, Math.ceil(availableFamilyNames.length * 0.6));
    
    logger.debug(`Created ${householdFamilyNames.length} family groups for potential households`);
    
    // Create each record in PayloadCMS
    for (const personData of personalInfoData.records) {
      try {
        logger.debug("Creating personal info record", { 
          firstName: personData.name.firstName,
          lastName: personData.name.lastName 
        });
        
        // Ensure status fields exist and have valid values
        if (!personData.status) {
          personData.status = {};
        }
        personData.status.residencyStatus = personData.status.residencyStatus || 'permanent';
        personData.status.lifeStatus = 'alive';
        
        // Set the address to a unique address using our registry
        if (!personData.contact) {
          personData.contact = {};
        }
        
        // Make sure email field uses the right property name
        if (personData.contact.emailAddress && !personData.contact.email_address) {
          personData.contact.email_address = personData.contact.emailAddress;
          delete personData.contact.emailAddress;
        }
        
        personData.contact.localAddress = addressRegistry.getUniqueAddress();
        
        // Use distributed date for createdAt if available
        if (demographicYears.length > 0) {
          personData.createdAt = getDistributedDate(demographicYears);
          logger.debug("Using distributed date for personal info", { date: personData.createdAt });
        }
        
        // Check if this person should be considered for household membership
        // Either because they have householdMembership=true or their last name is in our family groups
        const isHouseholdMember = 
          (personData.householdMembership === true) || 
          (personData.name && personData.name.lastName && householdFamilyNames.includes(personData.name.lastName));
        
        // Remove the helper field before saving
        delete personData.householdMembership;
        
        const person = await payload.create({
          collection: 'personal-information',
          data: personData
        });
        
        generatedIds.push(person.id);
        
        // If suitable for household, add to our tracking array
        if (isHouseholdMember) {
          householdReadyPersons.push({
            id: person.id,
            lastName: personData.name?.lastName || '',
            maritalStatus: personData.maritalStatus
          });
          logger.debug(`Marked ${personData.name?.firstName} ${personData.name?.lastName} for potential household inclusion`);
        }
        
        logger.debug("Created personal info record", { id: person.id });
      } catch (error) {
        logger.error(`Failed to create personal info record for ${personData.name?.firstName || 'unknown'}`, error);
      }
    }

    logger.info(`Successfully created ${generatedIds.length} personal information records`);
    logger.info(`Marked ${householdReadyPersons.length} records as suitable for household membership`);
    
    // Save the household-ready persons to global state for use in household generation
    global.householdReadyPersons = householdReadyPersons;
    
    return generatedIds;
  } catch (error) {
    logger.error("Error in generatePersonalInformation:", error);
    throw new Error(`Failed to generate personal information data: ${error.message}`);
  }
}

async function generateUsers(count, personalInfoIds, personalInfoRecords = []) {
  const generatedUserIds = [];

  try {
    logger.info(`Generating ${count} Filipino user records with matching emails`);
    
    // Create users with matched emails if personal info is available
    if (personalInfoRecords.length > 0) {
      for (let i = 0; i < Math.min(count, personalInfoRecords.length); i++) {
        try {
          const person = personalInfoRecords[i];
          const personId = personalInfoIds[i];
          
          // Generate a matching email from the person's name
          const firstName = person.name.firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
          const lastName = person.name.lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
          const randomDomain = Math.random() > 0.5 ? 'gmail.com' : 'yahoo.com';
          
          // Create various email formats
          let email;
          const uniqueSuffix = Date.now().toString().slice(-5) + Math.floor(Math.random() * 100); // Added for uniqueness
          const rand = Math.random();
          if (rand < 0.3) {
            email = `${firstName}.${lastName}${uniqueSuffix}@${randomDomain}`;
          } else if (rand < 0.6) {
            email = `${firstName}${lastName}${uniqueSuffix}@${randomDomain}`;
          } else {
            // Ensure this format also has good randomness and unique suffix
            email = `${firstName}${lastName}${Math.floor(Math.random() * 10000)}${uniqueSuffix.slice(0,3)}@${randomDomain}`;
          }
          
          // Generate a random role
          const roleRand = Math.random();
          const role = roleRand < 0.8 ? 'citizen' : (roleRand < 0.9 ? 'staff' : 'admin');
          
          // Create user data
          const userData = {
            email,
            password: "Password123!",
            role,
            personalInfo: personId,
            active: Math.random() < 0.9 // 90% active
          };
          
          logger.debug("Creating user record with matched email", { email, name: `${person.name.firstName} ${person.name.lastName}` });
          
          const user = await payload.create({
            collection: 'users',
            data: userData
          });
          
          generatedUserIds.push(user.id);
          logger.debug("Created matched user record", { id: user.id });
        } catch (error) {
          logger.error(`Failed to create matched user record`, error);
        }
      }
      
      // If we need more users than we have personal info records, generate additional ones
      if (count > personalInfoRecords.length) {
        const additionalCount = count - personalInfoRecords.length;
        const additionalUserIds = await generateGenericUsers(additionalCount, personalInfoIds.slice(personalInfoRecords.length));
        generatedUserIds.push(...additionalUserIds);
      }
    } else {
      // Fall back to generic user generation if no personal info is available
      const genericUserIds = await generateGenericUsers(count, personalInfoIds);
      generatedUserIds.push(...genericUserIds);
    }

    logger.info(`Successfully created ${generatedUserIds.length} user records`);
    return generatedUserIds;
  } catch (error) {
    logger.error("Error in generateUsers:", error);
    throw new Error(`Failed to generate user data: ${error.message}`);
  }
}

// Helper function for generating generic users when no personal info is available
async function generateGenericUsers(count, personalInfoIds) {
  const generatedUserIds = [];
  
  try {
    logger.info(`Generating ${count} generic Filipino user records`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.users;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} Filipino user records for a database.
    
    Requirements:
    - Use Filipino-style email addresses that match common Filipino names (e.g., juandelacruz@gmail.com for Juan De la Cruz)
    - Password should be set to "Password123!" for all users
    - Make most users (80%) citizens, with 10% staff and 10% admin
    - Make 90% of users active (set isActive to "active")
    - Each email should logically match a realistic Filipino name pattern
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini for generic users");
    
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = await result.response;
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let usersData;
    try {
      usersData = safeJsonParse(data, 'usersData');
      
      // Verify we have the records array
      if (!usersData.records || !Array.isArray(usersData.records)) {
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'usersArrayFallback');
          if (Array.isArray(arrayData)) {
            usersData = { records: arrayData };
          }
        }
        
        if (!usersData.records || !Array.isArray(usersData.records)) {
          throw new Error("Response missing records array");
        }
      }
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response", { rawData: data });
      throw new Error(`Failed to parse structured output: ${error.message}`);
    }
    
    // Create each record in PayloadCMS
    for (let i = 0; i < usersData.records.length; i++) {
      try {
        const userData = usersData.records[i];
        
        // Assign a personal info ID if available
        if (personalInfoIds.length > i) {
          userData.personalInfo = personalInfoIds[i];
        }
        
        // Make sure isActive is a valid value
        if (!userData.isActive) {
          userData.isActive = Math.random() < 0.9 ? 'active' : 'inactive';
        }

        // Ensure email is unique and handle missing email from AI
        if (userData.email) {
            const emailParts = userData.email.split('@');
            const uniqueSuffixForGeneric = Date.now().toString().slice(-5) + Math.floor(Math.random() * 10000);
            if (emailParts.length === 2) {
                // Sanitize username part for safety and add suffix
                userData.email = `${emailParts[0].toLowerCase().replace(/[^a-z0-9_.-]/gi, '')}${uniqueSuffixForGeneric}@${emailParts[1]}`;
            } else {
                // Fallback if AI email format is unexpected
                userData.email = `guser${uniqueSuffixForGeneric}@example.com`;
            }
        } else {
            // If AI provided no email
            const uniqueSuffixForGeneric = Date.now().toString().slice(-5) + Math.floor(Math.random() * 10000);
            userData.email = `guser${uniqueSuffixForGeneric}@example.com`;
        }
        
        logger.debug("Creating generic user record", { email: userData.email, role: userData.role });
        
        try {
        const user = await payload.create({
          collection: 'users',
          data: userData
        });
          
        generatedUserIds.push(user.id);
          logger.debug("Created generic user record", { id: user.id });
      } catch (error) {
          // If the error is about missing personal info, try creating without it
          if (error.message && error.message.includes('Personal Info')) {
            delete userData.personalInfo;
            const user = await payload.create({
              collection: 'users',
              data: userData
            });
            generatedUserIds.push(user.id);
            logger.debug("Created generic user record without personal info", { id: user.id });
          } else {
            throw error;
          }
        }
      } catch (error) {
        logger.error(`Failed to create generic user record`, error);
      }
    }

    logger.info(`Successfully created ${generatedUserIds.length} generic user records`);
    return generatedUserIds;
  } catch (error) {
    logger.error("Error in generateGenericUsers:", error);
    return generatedUserIds;
  }
}

async function generatePosts(count, userIds, demographicYears = []) {
  let postsCreated = 0;
  
  try {
    logger.info(`Generating ${count} Filipino blog posts`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.posts;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} blog posts for a Filipino community website.
    
    Requirements:
    - Make content relevant to Filipino community announcements, Barangay events, local news, or Filipino cultural activities
    - Include some Tagalog words and phrases
    - Make 80% of posts published and 20% drafts
    - Dates should be in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ)
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: sanitizeForPrompt(prompt) });
    
    // Make the API call with structured output
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = await result.response;
    logger.debug("Received response from Gemini API");
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let postsData;
    try {
      postsData = safeJsonParse(data, 'postsData');
      logger.debug("Successfully parsed JSON response");
      
      // Verify we have the records array
      if (!postsData.records || !Array.isArray(postsData.records)) {
        // Try one more fallback approach - look for an array directly
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'postsArrayFallback');
          if (Array.isArray(arrayData)) {
            postsData = { records: arrayData };
            logger.debug("Used fallback array extraction", { count: arrayData.length });
          }
        }
        
        if (!postsData.records || !Array.isArray(postsData.records)) {
          throw new Error("Response missing records array");
        }
      }
      logger.info(`Parsed ${postsData.records.length} post records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response", { rawData: data });
      throw new Error(`Failed to parse structured output: ${error.message}`);
    }
    
    // Create each record in PayloadCMS
    for (let i = 0; i < postsData.records.length; i++) {
      try {
        const postData = postsData.records[i];
        
        // Assign a random author from available user IDs
        postData.author = userIds[Math.floor(Math.random() * userIds.length)];
        
        // Apply distributed dates if available
        if (demographicYears.length > 0) {
          // Create a distributed date for post creation
          postData.createdAt = getDistributedDate(demographicYears);
          
          // For published posts, set publishedDate after creation date
          if (postData.status === 'published') {
            const creationDate = new Date(postData.createdAt);
            const publishDate = new Date(creationDate);
            
            // Publishing usually happens 0-3 days after creation
            publishDate.setDate(publishDate.getDate() + Math.floor(Math.random() * 4));
            postData.publishedDate = publishDate.toISOString();
          }
          
          // For posts with dates mentioned in content, try to make them consistent
          if (postData.content) {
            const creationYear = new Date(postData.createdAt).getFullYear();
            
            // Replace any year mentions in content with the creation year
            // This helps ensure event dates mentioned in posts are consistent with creation date
            postData.content = postData.content.replace(/\b(20\d\d)\b/g, creationYear.toString());
          }
          
          logger.debug("Using distributed dates for post", {
            title: postData.title,
            createdAt: postData.createdAt,
            publishedDate: postData.publishedDate,
            status: postData.status
          });
        }
        
        logger.debug("Creating post record", { title: postData.title });
        
        // Modify title to enhance slug uniqueness before creation
        if (postData.title) {
            postData.title = `${postData.title} #${Math.floor(Math.random() * 100000)}`;
        } else {
            postData.title = `Untitled Post ${Date.now().toString().slice(-5)}`; // Fallback for missing title
        }

        const post = await payload.create({
          collection: 'posts',
          data: postData
        });
        console.log("Payload Post: ", post);
        
        postsCreated++;
        logger.debug("Created post record", { count: postsCreated });
      } catch (error) {
        logger.error(`Failed to create post record`, error);
      }
    }

    logger.info(`Successfully created ${postsCreated} post records`);
    return postsCreated;
  } catch (error) {
    logger.error("Error in generatePosts:", error);
    throw new Error(`Failed to generate post data: ${error.message}`);
  }
}

async function generateHouseholds(count, personalInfoIds, demographicYears = []) {
  let householdsCreated = 0;
  
  try {
    logger.info(`Generating ${count} Filipino household records in Brgy. Malabanban Norte`);
    
    // First, check if we have household-ready persons from the previous generation step
    const householdReadyPersons = global.householdReadyPersons || [];
    logger.info(`Found ${householdReadyPersons.length} household-ready persons from previous generation`);
    
    // Group people by last name to form potential families
    const familyGroups = {};
    householdReadyPersons.forEach(person => {
      if (!person.lastName) return;
      
      if (!familyGroups[person.lastName]) {
        familyGroups[person.lastName] = [];
      }
      familyGroups[person.lastName].push(person);
    });
    
    // Get family names with multiple members (more likely to form households)
    const multiMemberFamilies = Object.keys(familyGroups).filter(
      lastName => familyGroups[lastName].length > 1
    );
    
    logger.info(`Found ${multiMemberFamilies.length} family groups with multiple members`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.households;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} household records for Filipino families in Brgy. Malabanban Norte, Candelaria, Quezon.
    
    Requirements:
    - Use common Filipino family names like Santos, Cruz, Reyes, Garcia, etc.
    - All addresses should be in Brgy. Malabanban Norte, Candelaria, Quezon (I will replace with specific addresses later)
    - Make all households active
    - Set residency dates within the past 10 years in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ)
    - Set member counts between 1 and 6 people per household
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: sanitizeForPrompt(prompt) });
    
    // Make the API call with structured output
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = result.response;
    logger.debug("Received response from Gemini API");
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let householdsData;
    try {
      householdsData = safeJsonParse(data, 'householdsData');
      logger.debug("Successfully parsed JSON response");
      
      // Verify we have the records array
      if (!householdsData.records || !Array.isArray(householdsData.records)) {
        // Try one more fallback approach - look for an array directly
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'householdsArrayFallback');
          if (Array.isArray(arrayData)) {
            householdsData = { records: arrayData };
            logger.debug("Used fallback array extraction", { count: arrayData.length });
          }
        }
        
        if (!householdsData.records || !Array.isArray(householdsData.records)) {
          throw new Error("Response missing records array");
        }
      }
      logger.info(`Parsed ${householdsData.records.length} household records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response", { rawData: data });
      throw new Error(`Failed to parse structured output: ${error.message}`);
    }
    
    // Track person IDs that have been assigned to households already
    const assignedPersons = new Set();
    
    // Create each record in PayloadCMS
    for (const householdData of householdsData.records) {
      try {
        // First, try to use family groupings if available
        let members = [];
        let familyUsed = false;
        let familyLastName = null;
        
        // If we have pre-grouped families, use one of them (40% chance for multi-member families, 60% for mixed)
        if (multiMemberFamilies.length > 0 && Math.random() < 0.4) {
          // Choose a random family with multiple members
          familyLastName = multiMemberFamilies[Math.floor(Math.random() * multiMemberFamilies.length)];
          const familyMembers = familyGroups[familyLastName].filter(p => !assignedPersons.has(p.id));
          
          // If we have at least two unassigned members, use this family
          if (familyMembers.length >= 2) {
            // Determine how many family members to include (2 to all available, max 6)
            const memberCount = Math.min(
              2 + Math.floor(Math.random() * (familyMembers.length - 1)), 
              6
            );
            
            // Select members from the family
            const selectedMembers = familyMembers.slice(0, memberCount);
            
            // Create member objects for the household
            members = selectedMembers.map(person => ({ member: person.id }));
            
            // Update household family name to match the family
            householdData.familyName = familyLastName;
            
            // Mark these persons as assigned
            selectedMembers.forEach(person => assignedPersons.add(person.id));
            
            familyUsed = true;
            logger.debug(`Using family group ${familyLastName} with ${members.length} members for household`);
          }
        }
        
        // If we didn't use a pre-grouped family, try to create a household with unassigned persons
        if (!familyUsed) {
          // Get member count from householdData or generate a random one (1-6)
          const memberCount = householdData.memberCount || 1 + Math.floor(Math.random() * 5);
          delete householdData.memberCount;
          
          // Select from household-ready persons who haven't been assigned yet
          const availablePersons = householdReadyPersons
            .filter(p => !assignedPersons.has(p.id))
            .sort(() => 0.5 - Math.random()); // Shuffle
          
          // If we have enough people, use them
          if (availablePersons.length >= memberCount) {
            const selectedPersons = availablePersons.slice(0, memberCount);
            
            members = selectedPersons.map(person => ({ member: person.id }));
            
            // Mark these persons as assigned
            selectedPersons.forEach(person => assignedPersons.add(person.id));
            
            // Try to determine family name from members
            // First, see if there's a dominant last name
            const lastNameCounts = {};
            selectedPersons.forEach(person => {
              if (person.lastName) {
                lastNameCounts[person.lastName] = (lastNameCounts[person.lastName] || 0) + 1;
              }
            });
            
            // Find the most common last name if any
            let maxCount = 0;
            selectedPersons.forEach(person => {
              if (person.lastName && lastNameCounts[person.lastName] > maxCount) {
                maxCount = lastNameCounts[person.lastName];
                familyLastName = person.lastName;
              }
            });
            
            // If we found a dominant family name, use it
            if (familyLastName) {
              householdData.familyName = familyLastName;
              logger.debug(`Created mixed household with dominant family name: ${familyLastName}`);
            } else {
              // Just use a random person's last name if available
              const personWithLastName = selectedPersons.find(p => p.lastName);
              if (personWithLastName) {
                familyLastName = personWithLastName.lastName;
                householdData.familyName = familyLastName;
              }
              logger.debug(`Created mixed household with ${members.length} random members`);
            }
          } else {
            // Fall back to random selection from all personal info IDs
            const availableIds = personalInfoIds.filter(id => !assignedPersons.has(id));
            
            if (availableIds.length >= memberCount) {
              // Randomly select member IDs
              const selectedIds = [];
              for (let i = 0; i < memberCount && availableIds.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * availableIds.length);
                const memberId = availableIds.splice(randomIndex, 1)[0];
                selectedIds.push(memberId);
              }
              
              members = selectedIds.map(id => ({ member: id }));
              
              // Mark these persons as assigned
              selectedIds.forEach(id => assignedPersons.add(id));
              
              // We'll need to fetch their info to determine family name
              try {
                const memberInfoPromises = selectedIds.map(id => 
                  payload.findByID({
                    collection: 'personal-information',
                    id
                  })
                );
                
                const memberInfos = await Promise.all(memberInfoPromises);
                
                // Try to determine family name from members
                // First, see if there's a dominant last name
                const lastNameCounts = {};
                memberInfos.forEach(info => {
                  if (info?.name?.lastName) {
                    lastNameCounts[info.name.lastName] = (lastNameCounts[info.name.lastName] || 0) + 1;
                  }
                });
                
                // Find the most common last name if any
                let maxCount = 0;
                let dominantLastName = null;
                Object.keys(lastNameCounts).forEach(lastName => {
                  if (lastNameCounts[lastName] > maxCount) {
                    maxCount = lastNameCounts[lastName];
                    dominantLastName = lastName;
                  }
                });
                
                // If we found a dominant family name, use it
                if (dominantLastName) {
                  familyLastName = dominantLastName;
                  householdData.familyName = dominantLastName;
                  logger.debug(`Set household family name to dominant last name: ${dominantLastName}`);
                } else {
                  // Just use a random person's last name if available
                  const personWithLastName = memberInfos.find(info => info?.name?.lastName);
                  if (personWithLastName) {
                    familyLastName = personWithLastName.name.lastName;
                    householdData.familyName = familyLastName;
                  }
                }
              } catch (error) {
                logger.error("Failed to fetch member info for family name determination", error);
              }
              
              logger.debug(`Created household with ${members.length} randomly selected members`);
            }
          }
        }
        
        // If we have members, continue creating the household
        if (members.length > 0) {
          householdData.members = members;
          
          // Create a unique household address
          const householdAddress = addressRegistry.getUniqueAddress();
          householdData.localAddress = householdAddress;
          
          // Use distributed date if available
          if (demographicYears.length > 0) {
            householdData.createdAt = getDistributedDate(demographicYears);
            
            // If we have residence date field, distribute that as well but ensure it's not later than creation
            if (householdData.residenceDate) {
              const creationDate = new Date(householdData.createdAt);
              let residenceDate;
              do {
                residenceDate = new Date(getDistributedDate(demographicYears));
              } while (residenceDate > creationDate);
              
              householdData.residenceDate = residenceDate.toISOString();
            }
            
            logger.debug("Using distributed dates for household", { 
              createdAt: householdData.createdAt, 
              residenceDate: householdData.residenceDate 
            });
          }
          
          // Ensure we have a family name that matches at least some members
          if (!householdData.familyName || householdData.familyName.trim() === '') {
            if (familyLastName) {
              householdData.familyName = familyLastName;
            } else {
              householdData.familyName = "Household " + Math.floor(Math.random() * 1000);
            }
          }
          
          logger.debug("Creating household record", { 
            familyName: householdData.familyName, 
            memberCount: members.length,
            address: householdAddress
          });
          
          const household = await payload.create({
            collection: 'households',
            data: householdData
          });
          console.log("Payload Household: ", household);
          
          householdsCreated++;
          logger.debug("Created household record", { id: household.id });
          
          // Store the household ID and address in the registry for consistent use
          if (household.id) {
            addressRegistry.householdAddresses[household.id] = householdAddress;
            
            // Update the addresses of all household members to match the household address
            for (const memberObj of householdData.members) {
              try {
                // Find the personal info record
                const personInfo = await payload.findByID({
                  collection: 'personal-information',
                  id: memberObj.member
                });
                
                const updates = {
                  contact: {
                    ...personInfo.contact,
                    localAddress: householdAddress
                  }
                };
                
                // If we should update last name to match household family name
                // Only do this for members who don't already have this last name
                // And only in certain cases based on relationship context
                if (personInfo.name && personInfo.name.lastName !== householdData.familyName) {
                  // 70% chance to update last name to match household
                  // This simulates marriage, adoption, or other reasons why someone might have a different last name
                  if (Math.random() < 0.7) {
                    logger.debug(`Updating last name for household member ${memberObj.member} to match household: ${householdData.familyName}`);
                    updates.name = {
                      ...personInfo.name,
                      lastName: householdData.familyName
                    };
                  }
                }
                
                // Update the person's data
                await payload.update({
                  collection: 'personal-information',
                  id: memberObj.member,
                  data: updates
                });
                
                logger.debug(`Updated household member ${memberObj.member} to match household address${updates.name ? ' and family name' : ''}`);
              } catch (memberError) {
                logger.error(`Failed to update address for household member ${memberObj.member}`, memberError);
              }
            }
          }
        } else {
          logger.warn(`Skipping household due to insufficient available members`);
        }
      } catch (error) {
        logger.error(`Failed to create household record`, error);
      }
    }

    logger.info(`Successfully created ${householdsCreated} household records`);
    logger.info(`Assigned ${assignedPersons.size} personal information records to households`);
    return householdsCreated;
  } catch (error) {
    logger.error("Error in generateHouseholds:", error);
    throw new Error(`Failed to generate household data: ${error.message}`);
  }
}

async function generateBusinesses(count, demographicYears = []) {
  let businessesCreated = 0;
  let permitsCreated = 0;
  
  try {
    logger.info(`Generating ${count} Filipino business records in Brgy. Malabanban Norte`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.business;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} business records for Filipino businesses in Brgy. Malabanban Norte, Candelaria, Quezon.
    
    Requirements:
    - Use Filipino-style business names (like sari-sari stores, carinderias, eateries, etc.)
    - All businesses should be located in Brgy. Malabanban Norte, Candelaria, Quezon (I will replace with specific addresses later)
    - Registration dates should be within the past 5 years in ISO format
    - Set 70% as active, 20% as inactive, and 10% as pending
    - Type of ownership should vary appropriately among sole proprietorship, partnership, corporation, and llc
    - Use Filipino full names for owners
    - Use Philippines mobile numbers (+63 format)
    - Business email addresses should logically match the business name (e.g., jollybeestore@gmail.com for "Jolly Bee Store")
    - IMPORTANT: Keep all titles and descriptions SHORT and CONCISE
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini for businesses");
    
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = result.response;
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let businessesData;
    try {
      // Clean up potentially problematic strings
      const cleanedData = data
        .replace(/("businessName":\s*"[^"]{50,})(")/g, '$1...$2') // Truncate long business names
        .replace(/("address":\s*"[^"]{100,})(")/g, '$1...$2')     // Truncate long addresses
        .replace(/("ownerName":\s*"[^"]{50,})(")/g, '$1...$2');   // Truncate long owner names
      
      businessesData = safeJsonParse(cleanedData, 'businessesData');
      
      // Verify we have the records array
      if (!businessesData.records || !Array.isArray(businessesData.records)) {
        const arrayMatch = cleanedData.match(/\[\s*\{[\s\S]*?\}\s*\]/); // Non-greedy match
        if (arrayMatch) {
          businessesData = { records: safeJsonParse(arrayMatch[0], 'businessesArrayFallback') };
        }
        
        if (!businessesData.records || !Array.isArray(businessesData.records)) {
          // Create fallback business records
          businessesData = { records: createFallbackBusinessRecords(count) };
          logger.warn("Failed to parse AI response, created fallback business records");
        }
      }
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response sample", { rawDataSample: data.substring(0, 500) + "..." });
      
      // Create fallback business records
      businessesData = { records: createFallbackBusinessRecords(count) };
      logger.warn("Using fallback business records due to parsing error");
    }
    
    // Create each record in PayloadCMS
    for (const businessData of businessesData.records) {
      try {
        // Sanitize string lengths
        if (businessData.businessName && businessData.businessName.length > 50) {
          businessData.businessName = businessData.businessName.substring(0, 47) + "...";
        }
        
        // Ensure owner arrays don't exceed reasonable size
        if (businessData.owners && Array.isArray(businessData.owners) && businessData.owners.length > 3) {
          businessData.owners = businessData.owners.slice(0, 3);
        }
        
        // Assign a unique address using our registry
        businessData.address = addressRegistry.getUniqueAddress();

        // Ensure businessEmailAddress is unique and present
        const safeBusinessName = (businessData.businessName || "business").toLowerCase().replace(/[^a-z0-9]/g, '');
        const uniqueSuffixBusiness = Date.now().toString().slice(-5) + Math.floor(Math.random() * 10000);
        const targetEmailField = 'businessEmailAddress'; // Based on ValidationError

        let providedEmail = businessData[targetEmailField] || businessData.email; // Check common AI-provided names

        if (providedEmail) {
            const emailParts = providedEmail.split('@');
            if (emailParts.length === 2) {
                businessData[targetEmailField] = `${emailParts[0].toLowerCase().replace(/[^a-z0-9_.-]/gi, '')}${uniqueSuffixBusiness}@${emailParts[1]}`;
            } else {
                businessData[targetEmailField] = `${safeBusinessName}${uniqueSuffixBusiness}@example.com`;
            }
        } else {
             businessData[targetEmailField] = `${safeBusinessName}${uniqueSuffixBusiness}@example.com`;
        }
        // Clean up if AI used 'email' but target is 'businessEmailAddress'
        if ('email' in businessData && targetEmailField !== 'email') {
            delete businessData.email;
        }
        
        // Apply distributed dates if available
        if (demographicYears.length > 0) {
          // Set business registration date from demographic years
          businessData.createdAt = getDistributedDate(demographicYears);
          
          // If there's a registration date, ensure it's not later than creation date
          if (businessData.registrationDate) {
            const creationDate = new Date(businessData.createdAt);
            let registrationDate;
            do {
              registrationDate = new Date(getDistributedDate(demographicYears));
            } while (registrationDate > creationDate);
            
            businessData.registrationDate = registrationDate.toISOString();
          }
          
          logger.debug("Using distributed dates for business", {
            businessName: businessData.businessName,
            createdAt: businessData.createdAt,
            registrationDate: businessData.registrationDate
          });
        }
        
        logger.debug("Creating business record", { businessName: businessData.businessName });
        
        const business = await payload.create({
          collection: 'business',
          data: businessData
        });
        
        businessesCreated++;
        logger.debug("Created business record", { id: business.id });

        // Generate a business permit for each active business
        if (business.status === 'active') {
          try {
            await generateBusinessPermit(business, demographicYears);
            permitsCreated++;
          } catch (permitError) {
            logger.error(`Failed to create business permit for "${business.businessName}"`, permitError);
            
            // Try to create a fallback permit
            try {
              await createFallbackBusinessPermit(business, demographicYears);
              permitsCreated++;
              logger.debug("Created fallback business permit for", { businessName: business.businessName });
            } catch (fallbackError) {
              logger.error(`Failed to create fallback permit for "${business.businessName}"`, fallbackError);
            }
          }
        }
      } catch (error) {
        logger.error(`Failed to create business record`, error);
      }
    }

    logger.info(`Successfully created ${businessesCreated} business records and ${permitsCreated} permits`);
    return { businessesCreated, permitsCreated };
  } catch (error) {
    logger.error("Error in generateBusinesses:", error);
    throw new Error(`Failed to generate business data: ${error.message}`);
  }
}

// In generateBusinessPermit function with timeout handling
async function generateBusinessPermit(business, demographicYears = []) {
  const permitSchema = schemas.businessPermit; // We might not need the full schema for the prompt anymore
  const permitModel = createStructuredModel(permitSchema); // Still useful for the call

  const sanitizedBusinessName = sanitizeForPrompt(business.businessName);
  const ownerNameForPrompt = business.owners && business.owners.length > 0
    ? sanitizeForPrompt(business.owners[0].ownerName)
    : "the business owner";

  // Simplified prompt asking for minimal, easy-to-generate data
  const permitPrompt = `Create a business permit for \"${sanitizedBusinessName}\" with these fields exactly: 
  1. officialReceiptNo: (a simple receipt number like BR-2025-12345)
  2. issuedTo: (name of business owner, keep this simple without special characters) 
  3. amount: (a number between 1000 and 5000)`;

  logger.debug(`Sending new simplified permit prompt for: ${sanitizedBusinessName}`);
  
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      const timeoutId = setTimeout(() => {
        clearTimeout(timeoutId);
        reject(new Error(`Timeout of 5000ms exceeded for permit generation of ${sanitizedBusinessName}`));
      }, 5000); // 5 second timeout
    });
    
    // Create the AI call promise
    const aiCallPromise = permitModel.generateContent({
      contents: [{ role: "user", parts: [{ text: permitPrompt }] }],
      generationConfig: {
        maxOutputTokens: 256, // Reduced for faster response
        temperature: 0.2    // Very low for deterministic output
      }
    });
    
    // Race the AI call against the timeout
    let permitResult;
    try {
      permitResult = await Promise.race([aiCallPromise, timeoutPromise]);
    } catch (e) {
      logger.warn(`AI call for permit timed out or errored: ${e.message}`);
      return createFallbackBusinessPermit(business, demographicYears);
    }
    
    // Continue with normal processing if the AI call won
    if (permitResult && permitResult.response) {
      let permitText = permitResult.response.text();
      logger.debug('Raw AI permit response', { length: permitText?.length, preview: permitText?.slice(0, 200) });
      if (permitText && permitText.trim() !== "") {
        const markdownJsonMatch = permitText.match(/```json\s*([\s\S]*?)\s*```/);
        if (markdownJsonMatch && markdownJsonMatch[1]) {
          permitText = markdownJsonMatch[1];
          logger.debug("Extracted JSON from markdown for permit (simplified attempt)");
        }
        try {
          logger.debug('Parsing AI permit JSON', { text: permitText?.slice(0, 200) });
          const aiGeneratedDetails = JSON.parse(permitText);
          // Validate the presence and basic type of AI generated fields
          if (!aiGeneratedDetails || typeof aiGeneratedDetails.officialReceiptNo !== 'string' || 
              typeof aiGeneratedDetails.issuedTo !== 'string' || 
              (typeof aiGeneratedDetails.amount !== 'number' && typeof aiGeneratedDetails.amount !== 'string')) {
            logger.warn("AI generated details missing or have wrong types for permit, using fallback.", {details: aiGeneratedDetails});
            return createFallbackBusinessPermit(business, demographicYears);
          }
          
          // Handle fields that might come in different formats
          if (aiGeneratedDetails.year && typeof aiGeneratedDetails.year === 'string') {
            aiGeneratedDetails.year = parseInt(aiGeneratedDetails.year, 10);
          }
          
          // Construct the permitData using AI details and defaults/logic
          const currentYear = new Date().getFullYear();
          let paymentDate;
          let validityDate;

          if (demographicYears.length > 0) {
            const businessCreationDate = new Date(business.createdAt || new Date());
            const now = new Date();
            do {
              paymentDate = new Date(getDistributedDate(demographicYears, { favorRecentMonths: true }));
            } while (paymentDate < businessCreationDate || paymentDate > now);
            
            validityDate = new Date(paymentDate);
            validityDate.setMonth(validityDate.getMonth() + 6 + Math.floor(Math.random() * 6));
          } else {
            paymentDate = new Date();
            paymentDate.setDate(paymentDate.getDate() - (Math.floor(Math.random() * 60) + 30)); // 1-3 months ago
            validityDate = new Date(paymentDate);
            validityDate.setFullYear(validityDate.getFullYear() + 1); // Valid for 1 year
          }

          // Ensure amount is a number by converting if needed
          let amount = aiGeneratedDetails.amount;
          if (typeof amount === 'string') {
            // Remove currency symbols, commas, etc. and parse
            amount = parseFloat(amount.replace(/[^\d.]/g, ''));
            if (isNaN(amount)) {
              amount = Math.floor(Math.random() * 4500) + 500; // Default 500-5000
            }
          }

          const permitData = {
            business: business.id,
            validity: validityDate.toISOString(),
            officialReceiptNo: (aiGeneratedDetails.officialReceiptNo || `FALLBACK-OR-${Date.now()}`).substring(0, 30),
            issuedTo: (aiGeneratedDetails.issuedTo || sanitizeForPrompt(business.owners[0]?.ownerName) || "Business Owner").substring(0, 50),
            amount: amount,
            paymentDate: paymentDate.toISOString(),
            status: "approved" // Defaulting to approved as per previous logic
          };
          
          logger.debug("Creating business permit with AI-assisted data", {
            businessId: permitData.business,
            receipt: permitData.officialReceiptNo,
            amount: permitData.amount
          });

          logger.debug('About to create business permit in Payload', {
            businessId: business.id,
            receipt: aiGeneratedDetails.officialReceiptNo,
            issuedTo: aiGeneratedDetails.issuedTo,
            amount: aiGeneratedDetails.amount
          });
          try {
            const permit = await payload.create({
              collection: 'business-permits',
              data: permitData
            });
            logger.debug('Successfully created business permit', { id: permit.id, businessName: business.businessName });
            return permit;
          } catch (dbError) {
            logger.error('Error creating permit in Payload, falling back.', {
              businessName: business.businessName,
              errorMessage: dbError.message,
              stack: dbError.stack
            });
            return createFallbackBusinessPermit(business, demographicYears);
          }
        } catch (parseError) {
          logger.error("Failed to parse AI response for permit, using fallback.", {
            error: parseError.message,
            textAttempted: permitText?.slice(0, 500)
          });
          return createFallbackBusinessPermit(business, demographicYears);
        }
      } else {
        logger.warn("Empty text in AI response for permit, using fallback.");
        return createFallbackBusinessPermit(business, demographicYears);
      }
    } else {
      logger.warn("AI did not return a response object for permit, using fallback.");
      return createFallbackBusinessPermit(business, demographicYears);
    }
  } catch (error) {
    // If timeout or other error, use fallback
    logger.warn(`Error or timeout in permit generation, using fallback: ${error.message}`);
    return createFallbackBusinessPermit(business, demographicYears);
  }
  // Final catch-all fallback
  return createFallbackBusinessPermit(business, demographicYears);
}

// Helper function to create a fallback business permit when AI generation fails
async function createFallbackBusinessPermit(business, demographicYears = []) {
  // Get owner name from the business record for consistency
  const ownerName = business.owners && business.owners.length > 0 
    ? business.owners[0].ownerName 
    : "Business Owner";
  
  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Get payment date (either distributed or recent)
  let paymentDate;
  if (demographicYears.length > 0) {
    const businessCreationDate = new Date(business.createdAt || new Date());
    const now = new Date();
    // Try to find a date after business creation but not in future
    do {
      paymentDate = new Date(getDistributedDate(demographicYears, { favorRecentMonths: true }));
    } while (paymentDate < businessCreationDate || paymentDate > now);
  } else {
    // Fallback to 1-3 months ago
    paymentDate = new Date();
    paymentDate.setMonth(paymentDate.getMonth() - Math.floor(Math.random() * 3) - 1);
  }
  
  // Set validity 6-12 months after payment date
  const validityDate = new Date(paymentDate);
  validityDate.setMonth(validityDate.getMonth() + 6 + Math.floor(Math.random() * 6));
  
  // Create permit data
  const permitData = {
    business: business.id,
    validity: validityDate.toISOString(),
    officialReceiptNo: `BP-${Math.floor(Math.random() * 10000)}-${currentYear}`,
    issuedTo: ownerName,
    amount: Math.floor(Math.random() * 9000) + 1000, // ₱1,000 - ₱10,000
    paymentDate: paymentDate.toISOString(),
    status: "approved"
  };
  
  logger.debug("Creating fallback business permit", {
    businessId: permitData.business,
    receipt: permitData.officialReceiptNo
  });

  const permit = await payload.create({
    collection: 'business-permits',
    data: permitData
  });
  
  logger.debug("Created fallback business permit", { id: permit.id, businessName: business.businessName });
  return permit;
}

// Helper function to create fallback business records if AI generation fails
function createFallbackBusinessRecords(count) {
  const records = [];
  
  const businessTemplates = [
    {
      businessName: "Malabanban Sari-Sari Store",
      status: "active",
      typeOfOwnership: "sole proprietorship",
      registrationDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year ago
    },
    {
      businessName: "Candelaria Food Carinderia",
      status: "active",
      typeOfOwnership: "partnership",
      registrationDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString() // 6 months ago
    },
    {
      businessName: "Barangay Fresh Market",
      status: "active",
      typeOfOwnership: "sole proprietorship",
      registrationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // 3 months ago
    },
    {
      businessName: "Quezon Computer Shop",
      status: "inactive",
      typeOfOwnership: "sole proprietorship",
      registrationDate: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString() // 2 years ago
    },
    {
      businessName: "Malabanban Construction Supply",
      status: "active",
      typeOfOwnership: "corporation",
      registrationDate: new Date(Date.now() - 545 * 24 * 60 * 60 * 1000).toISOString() // 1.5 years ago
    }
  ];
  
  const ownerNames = [
    "Juan Dela Cruz",
    "Maria Santos",
    "Ricardo Reyes",
    "Elena Bautista",
    "Pedro Garcia",
    "Sofia Mendoza"
  ];
  
  // Generate the requested number of business records
  for (let i = 0; i < count; i++) {
    // Use template in rotation
    const template = businessTemplates[i % businessTemplates.length];
    
    // Create owners (1-2 per business)
    const ownerCount = Math.random() < 0.7 ? 1 : 2;
    const owners = [];
    for (let o = 0; o < ownerCount; o++) {
      const ownerName = ownerNames[Math.floor(Math.random() * ownerNames.length)];
      owners.push({
        ownerName,
        contactNumber: `+63${9}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        email: `${ownerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`
      });
    }
    
    // Determine status with 70/20/10 distribution
    let status = template.status;
    const statusRand = Math.random();
    if (i % 5 === 0) { // Mix things up a bit for variety
      if (statusRand < 0.7) status = "active";
      else if (statusRand < 0.9) status = "inactive";
      else status = "pending";
    }
    
    // Create a business record
    records.push({
      ...template,
      businessName: `${template.businessName} ${i+1}`,
      status: status,
      owners: owners,
      email: `${template.businessName.toLowerCase().replace(/\s+/g, '')}${i+1}@gmail.com`,
      contactNumber: `+63${9}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
    });
  }
  
  return records;
}

async function generateReports(count, userIds, demographicYears = []) {
  let reportsCreated = 0;
  
  try {
    const headerList = await headers();
    const { user } = await payload.auth({ headers: headerList });
    const submitterUserId = user?.id;
    
    logger.info(`Generating ${count} Filipino incident reports for Brgy. Malabanban Norte`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.reports;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} incident reports for Brgy. Malabanban Norte, Candelaria, Quezon.
    
    Requirements:
    - Include titles that clearly describe common community incidents
    - Dates should be within the past 6 months in ISO format
    - Descriptions should be detailed and include some Tagalog phrases where appropriate
    - All locations must be within Brgy. Malabanban Norte, Candelaria, Quezon (I will replace with specific addresses later)
    - Each report should have 1-3 involved persons with appropriate roles (complainant, respondent, witness)
    - Make statements realistic and relevant to the incident
    - Status distribution: 50% open, 30% inProgress, 20% closed
    - Include incidents like noise complaints from karaoke, property disputes, etc.
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: sanitizeForPrompt(prompt) });
    
    // Make the API call with structured output
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = result.response;
    logger.debug("Received response from Gemini API");
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let reportsData;
    try {
      reportsData = safeJsonParse(data, 'reportsData');
      logger.debug("Successfully parsed JSON response");
      
      // Verify we have the records array
      if (!reportsData.records || !Array.isArray(reportsData.records)) {
        // Try one more fallback approach - look for an array directly
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'reportsArrayFallback');
          if (Array.isArray(arrayData)) {
            reportsData = { records: arrayData };
            logger.debug("Used fallback array extraction", { count: arrayData.length });
          }
        }
        
        if (!reportsData.records || !Array.isArray(reportsData.records)) {
          throw new Error("Response missing records array");
        }
      }
      logger.info(`Parsed ${reportsData.records.length} report records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response", { rawData: data });
      throw new Error(`Failed to parse structured output: ${error.message}`);
    }
    
    // Create each record in PayloadCMS
    for (const reportData of reportsData.records) {
      try {
        // Set the submitter to the current user or use a fallback ID
        reportData.submittedBy = submitterUserId || userIds[Math.floor(Math.random() * userIds.length)];
        
        // Assign a unique address using our registry
        reportData.location = addressRegistry.getUniqueAddress();
        
        // Apply distributed dates if available
        if (demographicYears.length > 0) {
          // Reports creation date - favor more recent dates for reports
          reportData.createdAt = getDistributedDate(demographicYears, { favorRecentMonths: true });
          
          // If report has an incident date, make sure it's not after creation date
          if (reportData.incidentDate) {
            const creationDate = new Date(reportData.createdAt);
            let incidentDate;
            // Incident should be slightly before report creation (0-30 days)
            do {
              incidentDate = new Date(creationDate);
              incidentDate.setDate(incidentDate.getDate() - Math.floor(Math.random() * 30));
            } while (incidentDate > creationDate);
            
            reportData.incidentDate = incidentDate.toISOString();
          }
          
          // For closed/inProgress reports, add resolution dates
          if (reportData.status === 'closed') {
            const creationDate = new Date(reportData.createdAt);
            const resolutionDate = new Date(creationDate);
            // Resolve between 7-60 days after creation
            resolutionDate.setDate(resolutionDate.getDate() + 7 + Math.floor(Math.random() * 53));
            reportData.resolutionDate = resolutionDate.toISOString();
          }
          
          logger.debug("Using distributed dates for report", {
            title: reportData.title,
            createdAt: reportData.createdAt,
            incidentDate: reportData.incidentDate,
            resolutionDate: reportData.resolutionDate
          });
        }
        
        logger.debug("Creating report record", { title: reportData.title });
        
        const report = await payload.create({
          collection: 'reports',
          data: reportData
        });
        console.log("Payload Report: ", report);
        
        reportsCreated++;
        logger.debug("Created report record", { id: report.id });
      } catch (error) {
        logger.error(`Failed to create report record`, error);
      }
    }

    logger.info(`Successfully created ${reportsCreated} report records`);
    return reportsCreated;
  } catch (error) {
    logger.error("Error in generateReports:", error);
    throw new Error(`Failed to generate report data: ${error.message}`);
  }
}

async function generateRequests(count, personalInfoIds, demographicYears = []) {
  let requestsCreated = 0;
  
  try {
    logger.info(`Generating ${count} Filipino document requests for Brgy. Malabanban Norte residents`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.requests;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} document requests for Brgy. Malabanban Norte, Candelaria, Quezon residents.
    
    Requirements:
    - Include different request types: indigencyCertificate, barangayClearance, and barangayResidency
    - Purposes should relate to Filipino needs (job applications, scholarship requirements, PhilHealth, etc.)
    - Status distribution: 40% pending, 25% processing, 20% approved, 5% rejected, 10% completed
    - Additional information should include:
      - forWhom: The Filipino person's name the document is for
      - remarks: Any special notes about the request (mention they are residents of Brgy. Malabanban Norte)
      - duration: Usually "6 months" for validity period
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: sanitizeForPrompt(prompt) });
    
    // Make the API call with structured output
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = result.response;
    logger.debug("Received response from Gemini API");
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let requestsData;
    try {
      requestsData = safeJsonParse(data, 'requestsData');
      logger.debug("Successfully parsed JSON response");
      
      // Verify we have the records array
      if (!requestsData.records || !Array.isArray(requestsData.records)) {
        // Try one more fallback approach - look for an array directly
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'requestsArrayFallback');
          if (Array.isArray(arrayData)) {
            requestsData = { records: arrayData };
            logger.debug("Used fallback array extraction", { count: arrayData.length });
          }
        }
        
        if (!requestsData.records || !Array.isArray(requestsData.records)) {
          throw new Error("Response missing records array");
        }
      }
      logger.info(`Parsed ${requestsData.records.length} request records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response", { rawData: data });
      throw new Error(`Failed to parse structured output: ${error.message}`);
    }
    
    // Create each record in PayloadCMS
    for (const requestData of requestsData.records) {
      try {
        // Assign a random person from available personal info IDs
        const personId = personalInfoIds[Math.floor(Math.random() * personalInfoIds.length)];
        requestData.person = personId;
        
        // Apply distributed dates if available
        if (demographicYears.length > 0) {
          // Favor recent months more heavily for requests since they're usually time-sensitive
          requestData.createdAt = getDistributedDate(demographicYears, { favorRecentMonths: true });
          
          // Apply dates for different status types
          const creationDate = new Date(requestData.createdAt);
          
          // For non-pending statuses, add appropriate dates
          if (requestData.status === 'processing') {
            // Processing usually starts 1-3 days after creation
            const processingDate = new Date(creationDate);
            processingDate.setDate(processingDate.getDate() + 1 + Math.floor(Math.random() * 3));
            requestData.processingDate = processingDate.toISOString();
          } 
          else if (requestData.status === 'approved' || requestData.status === 'rejected') {
            // Processing date (1-3 days after creation)
            const processingDate = new Date(creationDate);
            processingDate.setDate(processingDate.getDate() + 1 + Math.floor(Math.random() * 3));
            requestData.processingDate = processingDate.toISOString();
            
            // Decision date (1-5 days after processing)
            const decisionDate = new Date(processingDate);
            decisionDate.setDate(decisionDate.getDate() + 1 + Math.floor(Math.random() * 5));
            requestData.decisionDate = decisionDate.toISOString();
          }
          else if (requestData.status === 'completed') {
            // Processing date (1-3 days after creation)
            const processingDate = new Date(creationDate);
            processingDate.setDate(processingDate.getDate() + 1 + Math.floor(Math.random() * 3));
            requestData.processingDate = processingDate.toISOString();
            
            // Decision date (1-5 days after processing)
            const decisionDate = new Date(processingDate);
            decisionDate.setDate(decisionDate.getDate() + 1 + Math.floor(Math.random() * 5));
            requestData.decisionDate = decisionDate.toISOString();
            
            // Completion date (1-7 days after decision)
            const completionDate = new Date(decisionDate);
            completionDate.setDate(completionDate.getDate() + 1 + Math.floor(Math.random() * 7));
            requestData.completionDate = completionDate.toISOString();
          }
          
          logger.debug("Using distributed dates for request", {
            status: requestData.status,
            createdAt: requestData.createdAt,
            processingDate: requestData.processingDate,
            decisionDate: requestData.decisionDate,
            completionDate: requestData.completionDate
          });
        }
        
        // Add certificate and CTC details for processing, approved, or completed requests
        if (['processing', 'approved', 'completed'].includes(requestData.status)) {
          // Get the date reference points based on status
          let referenceDate;
          if (requestData.status === 'processing' && requestData.processingDate) {
            referenceDate = new Date(requestData.processingDate);
          } else if (requestData.status === 'approved' && requestData.decisionDate) {
            referenceDate = new Date(requestData.decisionDate);
          } else if (requestData.status === 'completed' && requestData.completionDate) {
            referenceDate = new Date(requestData.completionDate);
          } else {
            // Default to current date if no specific date is available
            referenceDate = new Date();
          }
          
          // Generate certificate details
          const dateIssued = new Date(referenceDate);
          
          // Create validity date (6 months after issuance)
          const validUntil = new Date(dateIssued);
          validUntil.setMonth(validUntil.getMonth() + 6);
          
          // Generate control number - format: TYPE-CURRENTYEAR-SEQUENCE
          const typePrefixes = {
            'indigencyCertificate': 'INDCY',
            'barangayClearance': 'BRGCL',
            'barangayResidency': 'BRGRS'
          };
          const typePrefix = typePrefixes[requestData.type] || 'CERT';
          const currentYear = dateIssued.getFullYear();
          const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
          const controlNumber = `${typePrefix}-${currentYear}-${sequence}`;
          
          // Generate CTC details
          const ctcDateIssued = new Date(dateIssued);
          // CTC is usually issued 0-30 days before certificate
          ctcDateIssued.setDate(ctcDateIssued.getDate() - Math.floor(Math.random() * 30));
          
          // Generate CTC number - format: CTC-CURRENTYEAR-SEQUENCE
          const ctcSequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
          const ctcNo = `CTC-${ctcDateIssued.getFullYear()}-${ctcSequence}`;
          
          // Generate random amount between 50 and 200 pesos
          // const ctcAmount = `₱${Math.floor(Math.random() * 150) + 50}.00`;
          const ctcAmount = `₱150.00`;
          
          // Certificate details
          requestData.certificateDetails = {
            controlNumber,
            dateIssued: dateIssued.toISOString().split('T')[0], // YYYY-MM-DD format
            validUntil: validUntil.toISOString().split('T')[0], // YYYY-MM-DD format
            
            // CTC Details
            ctcDetails: {
              ctcNo,
              ctcDateIssued: ctcDateIssued.toISOString().split('T')[0], // YYYY-MM-DD format
              ctcAmount,
              ctcPlaceIssued: 'Brgy. Malabanban Norte, Candelaria, Quezon'
            },
            
            // Payment details
            payment: {
              orNumber: `OR-${currentYear}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
              amount: `₱${Math.floor(Math.random() * 100) + 50}.00`,
              date: dateIssued.toISOString().split('T')[0], // YYYY-MM-DD format
              method: Math.random() < 0.8 ? 'cash' : (Math.random() < 0.5 ? 'online' : 'free')
            }
          };
          
          // Add approver details if approved or completed
          if (['approved', 'completed'].includes(requestData.status)) {
            // List of possible barangay officials
            const officials = [
              { name: 'Ricardo Santos', position: 'Barangay Captain' },
              { name: 'Maria Reyes', position: 'Barangay Secretary' },
              { name: 'Juan Dela Cruz', position: 'Barangay Kagawad' },
              { name: 'Elena Bautista', position: 'Barangay Treasurer' }
            ];
            
            const official = officials[Math.floor(Math.random() * officials.length)];
            
            requestData.certificateDetails.approver = {
              name: official.name,
              position: official.position,
              date: dateIssued.toISOString().split('T')[0] // YYYY-MM-DD format
            };
          }
          
          logger.debug("Added certificate and CTC details for request", {
            type: requestData.type,
            status: requestData.status,
            controlNumber: controlNumber,
            ctcNo: ctcNo
          });
        }
        
        logger.debug("Creating request record", { type: requestData.type });
        
        const request = await payload.create({
          collection: 'requests',
          data: requestData
        });
        console.log("Payload Request: ", request);
        
        requestsCreated++;
        logger.debug("Created request record", { id: request.id });
      } catch (error) {
        logger.error(`Failed to create request record`, error);
      }
    }

    logger.info(`Successfully created ${requestsCreated} request records`);
    return requestsCreated;
  } catch (error) {
    logger.error("Error in generateRequests:", error);
    throw new Error(`Failed to generate request data: ${error.message}`);
  }
}

async function generateFinancing(count, userIds, demographicYears = []) {
  let financingCreated = 0;
  let auditLogsCreated = 0;
  const generatedFinancingIds = []; // Keep track of created IDs
  const availableUserIds = [...userIds];

  if (availableUserIds.length === 0) {
    logger.warn("No user IDs available for Financing creation (createdBy field). Skipping financing generation.");
    return { financingCreated: 0, auditLogsCreated: 0, financingIds: [] };
  }
  
  try {
    logger.info(`Generating ${count} barangay financing records for Brgy. Malabanban Norte`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.financing;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} financing records specifically for Brgy. Malabanban Norte, Candelaria, Quezon.
    
    Requirements:
    - Create titles for BARANGAY-LEVEL projects only (NOT municipal or city level)
    - Include "Brgy. Malabanban Norte" in the titles and descriptions
    - Use realistic barangay development projects like: basketball court repair, drainage improvement, barangay hall renovation, waiting shed construction, health center equipment, etc.
    - Distribution of approval states: 30% draft, 20% submitted, 20% under_review, 20% approved, 10% rejected
    - Account types should vary among: capital, operational, grant, revenue, transfer
    - Include fiscal years between 2020-2024
    - Provide a "budgetedAmount" as a JSON number (e.g., 150000, 75000.50) for REALISTIC BARANGAY-LEVEL budgets:
      - Small projects: 10000 - 100000
      - Medium projects: 100001 - 500000 
      - Large projects (rare): 500001 - 2000000
    - Include budget reference codes with format: BRGY-MBN-[YEAR]-[SEQUENCE]
    - Include department codes with format: MBN-[DEPT]-[SEQUENCE] (where DEPT is short code for department)
    - Include justifications relevant to barangay governance context
    - Authorization references should refer to Barangay Resolutions or Ordinances (e.g., "Barangay Resolution No. 23, Series of 2023")
    - Each record should have 1-3 calculation groups (set as groupsCount)
    - IMPORTANT: Keep all titles and descriptions SHORT and CONCISE (max 50 characters for titles, 200 for descriptions)
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: sanitizeForPrompt(prompt) });
    
    // Make the API call with structured output
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = result.response;
    logger.debug("Received response from Gemini API");
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let financingData;
    try {
      // Try to fix common AI generation issues before parsing
      const cleanedData = data
        // Limit extremely long strings that might cause parsing issues
        .replace(/("title":\s*"[^"]{100,})(")/g, '$1...$2') // Truncate title strings longer than 100 chars
        .replace(/("description":\s*"[^"]{300,})(")/g, '$1...$2'); // Truncate description strings longer than 300 chars
      
      financingData = safeJsonParse(cleanedData, 'financingData');
      logger.debug("Successfully parsed JSON response");
      
      // Verify we have the records array
      if (!financingData.records || !Array.isArray(financingData.records)) {
        // Try one more fallback approach - look for an array directly
        const arrayMatch = data.match(/\[\s*\{[\s\S]*?\}\s*\]/); // Non-greedy match to avoid capturing too much
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'financingArrayFallback');
          if (Array.isArray(arrayData)) {
            financingData = { records: arrayData };
            logger.debug("Used fallback array extraction", { count: arrayData.length });
          }
        }
        
        if (!financingData.records || !Array.isArray(financingData.records)) {
          // Last resort: Try to create at least a few basic records manually
          financingData = { 
            records: createFallbackFinancingRecords(count, demographicYears)
          };
          logger.warn("Failed to parse AI response, created fallback financing records", { count: financingData.records.length });
        }
      }
      logger.info(`Parsed ${financingData.records.length} financing records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response snippet", { 
        rawDataSample: data.substring(0, 500) + "..." // Only log a sample to avoid huge logs
      });
      
      // Create some fallback records to ensure the function can continue
      financingData = { 
        records: createFallbackFinancingRecords(count, demographicYears)
      };
      logger.warn("Using fallback financing records due to parsing error", { count: financingData.records.length });
    }
    
    // Process and sanitize the records before creating them
    const sanitizedRecords = financingData.records.map(record => {
      // Ensure title is not too long
      if (record.title && record.title.length > 100) {
        record.title = record.title.substring(0, 97) + "...";
      }
      
      // Ensure description is not too long
      if (record.description && record.description.length > 500) {
        record.description = record.description.substring(0, 497) + "...";
      }
      
      // Process groups if they exist
      if (record.groups && Array.isArray(record.groups)) {
        record.groups = record.groups.map(group => {
          // Limit group title length
          if (group.title && group.title.length > 50) {
            group.title = group.title.substring(0, 47) + "...";
          }
          
          // Process items if they exist
          if (group.items && Array.isArray(group.items)) {
            group.items = group.items.map(item => {
              // Limit item title length
              if (item.title && item.title.length > 50) {
                item.title = item.title.substring(0, 47) + "...";
              }
              return item;
            });
          }
          return group;
        });
      }
      
      return record;
    });
    
    // Create each record in PayloadCMS
    for (const financeData of sanitizedRecords) {
      try {
        // Assign a random creator from available user IDs (admin or staff only)
        const creatorId = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
        
        // Extract and remove groupsCount from data
        const groupsCount = financeData.groupsCount || 1;
        delete financeData.groupsCount;
        
        // Apply distributed dates if available
        if (demographicYears.length > 0) {
          // Set finance record creation date
          financeData.createdAt = getDistributedDate(demographicYears);
          
          // Use fiscal year that matches demographic years if possible
          if (financeData.fiscalYear && demographicYears.includes(parseInt(financeData.fiscalYear))) {
            // Keep the existing fiscal year if it matches a demographic year
          } else {
            // Otherwise select a random demographic year
            financeData.fiscalYear = demographicYears[Math.floor(Math.random() * demographicYears.length)].toString();
          }
          
          logger.debug("Using distributed dates for financing", {
            title: financeData.title,
            createdAt: financeData.createdAt,
            fiscalYear: financeData.fiscalYear
          });
        }
        
        // Ensure "Brgy. Malabanban Norte" is in the title if not already
        if (financeData.title && !financeData.title.includes("Malabanban Norte")) {
          financeData.title = `${financeData.title} - Brgy. Malabanban Norte`;
        }
        
        // Ensure all budget codes follow the Malabanban Norte format
        if (financeData.budgetReferenceCode && !financeData.budgetReferenceCode.includes("MBN")) {
          const year = financeData.fiscalYear || new Date().getFullYear();
          const sequence = Math.floor(Math.random() * 100).toString().padStart(3, '0');
          financeData.budgetReferenceCode = `BRGY-MBN-${year}-${sequence}`;
        }
        
        // Validate budget ranges for barangay-level budgets
        if (financeData.budgetedAmount) {
          // Try to parse the budgeted amount (remove currency symbols, commas)
          let amount = 0;
          try {
            amount = parseFloat(financeData.budgetedAmount.toString().replace(/[₱,]/g, ''));
          } catch (e) {
            // If parsing fails, just assign a random valid amount
            amount = 0;
          }
          
          // Check if amount is outside realistic barangay budget ranges
          if (amount <= 0 || amount > 2000000) {
            // Assign a new realistic amount based on a distribution:
            // 60% small projects, 30% medium projects, 10% large projects
            const budgetClass = Math.random();
            let newAmount;
            
            if (budgetClass < 0.6) {
              // Small project (₱10,000 - ₱100,000)
              newAmount = Math.floor(Math.random() * 90000) + 10000;
            } else if (budgetClass < 0.9) {
              // Medium project (₱100,000 - ₱500,000)
              newAmount = Math.floor(Math.random() * 400000) + 100000;
            } else {
              // Large project (₱500,000 - ₱2,000,000)
              newAmount = Math.floor(Math.random() * 1500000) + 500000;
            }
            
            // Format with Philippine peso sign and commas
            financeData.budgetedAmount = `₱${newAmount.toLocaleString('en-PH')}`;
            logger.debug(`Adjusted financing budget to realistic barangay level: ${financeData.budgetedAmount}`);
          }
        }
        
        // Generate groups and items
        const groupsSchema = schemas.financingGroups;
        const groupsModel = createStructuredModel(groupsSchema);
        
        const groupsPrompt = `Generate ${groupsCount} calculation groups for a Filipino barangay financing project titled "${financeData.title}".
        
        Requirements:
        - Create groups relevant to BARANGAY-LEVEL budgeting (not municipal or city)
        - Focus on small-scale projects specific to Brgy. Malabanban Norte
        - Examples: Materials, Labor, Permits, Equipment Rental, Community Contributions
        - Each group should have a SHORT title (max 30 characters) and optional description (max 100 characters)
        - Subtotal operations should be one of: sum, average, min, max
        - Each group should have 2-3 items (specified as itemsCount)
        - IMPORTANT: Keep ALL titles and text SHORT and CONCISE
        
        Return the data as structured JSON matching the specified schema.`;

        logger.debug("Sending groups prompt to Gemini");
        
        const groupsResult = await groupsModel.generateContent({
          contents: [{ role: "user", parts: [{ text: groupsPrompt }] }]
        });
        
        const groupsResponse = groupsResult.response;
        const groupsText = groupsResponse.text();
        
        // Parse the groups data
        let groupsData;
        try {
          // Clean up potentially problematic strings before parsing
          const cleanedGroupsText = groupsText
            .replace(/("title":\s*"[^"]{50,})(")/g, '$1...$2')  // Truncate long titles
            .replace(/("description":\s*"[^"]{100,})(")/g, '$1...$2'); // Truncate long descriptions
          
          groupsData = safeJsonParse(cleanedGroupsText, 'financingGroups');
          
          if (!groupsData.records || !Array.isArray(groupsData.records)) {
            const arrayMatch = cleanedGroupsText.match(/\[\s*\{[\s\S]*?\}\s*\]/); // Non-greedy match
            if (arrayMatch) {
              groupsData = { records: safeJsonParse(arrayMatch[0], 'groupsArrayFallback') };
            } else {
              // Fallback to basic groups if parsing fails
              groupsData = { 
                records: [
                  { title: "Materials", operation: "sum", itemsCount: 2 },
                  { title: "Labor", operation: "sum", itemsCount: 2 }
                ]
              };
            }
          }
        } catch (error) {
          logger.error("Failed to parse groups data", error);
          // Fallback to basic groups
          groupsData = { 
            records: [
              { title: "Materials", operation: "sum", itemsCount: 2 },
              { title: "Labor", operation: "sum", itemsCount: 2 }
            ]
          };
        }
        
        // Process each group and generate items
        const groups = [];
        
        for (const groupData of groupsData.records) {
          // Sanitize group title
          if (groupData.title && groupData.title.length > 50) {
            groupData.title = groupData.title.substring(0, 47) + "...";
          }
          
          // Generate items for this group
          const itemsSchema = schemas.financingItems;
          const itemsModel = createStructuredModel(itemsSchema);
          const itemsCount = groupData.itemsCount || 2; // Default to 2 items if not specified
          delete groupData.itemsCount;
          
          const itemsPrompt = `Generate ${itemsCount} calculation items for a barangay financing group titled "${groupData.title}" for a project in Brgy. Malabanban Norte.
          
          Requirements:
          - Create numbered items (1, 2, 3, etc.)
          - Titles should be specific to barangay-level spending for "${financeData.title}"
          - Keep titles SHORT (max 30 characters)
          - Values should be appropriate for barangay budgets:
            - Small items: ₱1,000 - ₱50,000
            - Medium items: ₱50,000 - ₱200,000
            - Large items (rare): ₱200,000 - ₱500,000
          - Operations should vary among: add, subtract, multiply, divide
          - Include relevant accounting codes with format MBN-ACCT-XX
          - Fiscal periods should be quarters like Q1 ${financeData.fiscalYear}, Q2 ${financeData.fiscalYear}, etc.
          
          Return the data as structured JSON matching the specified schema.`;

          logger.debug("Sending items prompt to Gemini");
          
          const itemsResult = await itemsModel.generateContent({
            contents: [{ role: "user", parts: [{ text: itemsPrompt }] }]
          });
          
          const itemsResponse = itemsResult.response;
          const itemsText = itemsResponse.text();
          
          // Parse the items data
          let itemsData;
          try {
            // Clean up potentially problematic strings
            const cleanedItemsText = itemsText
              .replace(/("title":\s*"[^"]{50,})(")/g, '$1...$2'); // Truncate long titles
            
            itemsData = safeJsonParse(cleanedItemsText, 'financingItems');
            
            if (!itemsData.records || !Array.isArray(itemsData.records)) {
              const arrayMatch = cleanedItemsText.match(/\[\s*\{[\s\S]*?\}\s*\]/); // Non-greedy match
              if (arrayMatch) {
                itemsData = { records: safeJsonParse(arrayMatch[0], 'itemsArrayFallback') };
              } else {
                // Create fallback items if parsing fails
                itemsData = createFallbackItems(itemsCount, financeData.fiscalYear, groupData.title);
              }
            }
          } catch (error) {
            logger.error("Failed to parse items data", error);
            // Create fallback items
            itemsData = createFallbackItems(itemsCount, financeData.fiscalYear, groupData.title);
          }
          
          // Sanitize and process items
          const processedItems = itemsData.records.map(item => {
            // Limit title length
            if (item.title && item.title.length > 50) {
              item.title = item.title.substring(0, 47) + "...";
            }
            
            // Adjust fiscal periods to match the selected fiscal year if available
            if (demographicYears.length > 0 && financeData.fiscalYear) {
              if (item.fiscalPeriod) {
                // Extract quarter information if available
                const quarterMatch = item.fiscalPeriod.match(/Q([1-4])/i);
                if (quarterMatch) {
                  const quarter = quarterMatch[1];
                  item.fiscalPeriod = `Q${quarter} ${financeData.fiscalYear}`;
                } else {
                  // If no quarter info, just use the fiscal year
                  item.fiscalPeriod = `Q${Math.floor(Math.random() * 4) + 1} ${financeData.fiscalYear}`;
                }
              }
            }
            
            // Validate item value for barangay-level budget items
            if (item.value) {
              // Try to parse the value (remove currency symbols, commas)
              let amount = 0;
              try {
                amount = parseFloat(item.value.toString().replace(/[₱,]/g, ''));
              } catch (e) {
                // If parsing fails, just assign a random valid amount
                amount = 0;
              }
              
              // Check if amount is outside realistic barangay budget ranges for items
              if (amount <= 0 || amount > 500000) {
                // Assign a new realistic amount based on a distribution:
                // 70% small items, 25% medium items, 5% large items
                const itemClass = Math.random();
                let newAmount;
                
                if (itemClass < 0.7) {
                  // Small item (₱1,000 - ₱50,000)
                  newAmount = Math.floor(Math.random() * 49000) + 1000;
                } else if (itemClass < 0.95) {
                  // Medium item (₱50,000 - ₱200,000)
                  newAmount = Math.floor(Math.random() * 150000) + 50000;
                } else {
                  // Large item (₱200,000 - ₱500,000)
                  newAmount = Math.floor(Math.random() * 300000) + 200000;
                }
                
                item.value = newAmount;
                logger.debug(`Adjusted financing item value to realistic barangay level: ₱${newAmount.toLocaleString('en-PH')}`);
              }
            }
            
            // Ensure account code follows MBN format
            if (item.accountCode && !item.accountCode.includes("MBN")) {
              const sequence = Math.floor(Math.random() * 100).toString().padStart(2, '0');
              item.accountCode = `MBN-ACCT-${sequence}`;
            }
            
            return item;
          });
          
          groupData.items = processedItems;
          groups.push(groupData);
        }
        
        // Generate final calculations
        const finalCalculations = [];
        
        // Create some simple final calculations
        for (let i = 0; i < 3; i++) {
          finalCalculations.push({
            number: i + 1,
            title: i === 0 ? "Total Budget" : i === 1 ? "Contingency Reserve" : "Final Amount",
            operation: i === 0 ? "groupRef" : i === 1 ? "multiply" : "add",
            value: i === 0 ? null : i === 1 ? 0.1 : 0,
            groupReference: i === 0 ? 0 : null
          });
        }
        
        // Create complete record
        financeData.groups = groups;
        financeData.finalCalculations = finalCalculations;
        financeData.createdBy = creatorId;
        
        // Add approval history if not in draft
        if (financeData.approvalState !== 'draft') {
          const approvalHistory = [];
          
          // Generate appropriate history based on current status
          const statuses = ['draft', 'submitted', 'under_review', 'approved', 'rejected'];
          const currentStatusIndex = statuses.indexOf(financeData.approvalState);
          
          // Generate appropriate history with appropriate timeline if we have demographic years
          for (let i = 0; i <= currentStatusIndex; i++) {
            let timestamp;
            
            if (demographicYears.length > 0 && financeData.createdAt) {
              // Base on created date
              const creationDate = new Date(financeData.createdAt);
              timestamp = new Date(creationDate);
              // Each approval step is 5-14 days after the previous
              timestamp.setDate(timestamp.getDate() + (i * (5 + Math.floor(Math.random() * 9))));
            } else {
              // Fall back to standard approach
              const daysAgo = (currentStatusIndex - i) * 7; // Each step is 7 days apart
              timestamp = new Date();
              timestamp.setDate(timestamp.getDate() - daysAgo);
            }
            
            // Set approver title based on barangay governance structure
            const approverTitles = [
              "Barangay Secretary",
              "Barangay Treasurer", 
              "Barangay Kagawad for Finance",
              "Barangay Captain"
            ];
            
            const approverTitle = approverTitles[Math.min(i, approverTitles.length - 1)];
            
            approvalHistory.push({
              state: statuses[i],
              timestamp: timestamp.toISOString(),
              user: approverTitle,
              notes: i === 0 ? "Initial draft created for Brgy. Malabanban Norte project" : 
                     i === 1 ? "Submitted for review to Barangay Council" :
                     i === 2 ? "Under review by Barangay Finance Committee" :
                     i === 3 ? "Approved by Barangay Council during session" :
                     "Rejected due to budget constraints or missing requirements"
            });
          }
          
          financeData.approvalHistory = approvalHistory;
        }
        
        logger.debug("Creating financing record", { title: financeData.title });
        
        const financing = await payload.create({
          collection: 'financing',
          data: financeData
        });
        
        financingCreated++;
        logger.debug("Created financing record", { id: financing.id, title: financing.title });
        if (financing.id) {
          generatedFinancingIds.push(financing.id); // Store the ID
        }
        
        // Generate corresponding audit log entries
        if (financing.id) {
          // Create an audit log entry for the creation
          const creationAudit = await payload.create({
            collection: 'financing-audit-log',
            data: {
              timestamp: financeData.createdAt || new Date().toISOString(),
              user: creatorId,
              action: 'create',
              record: financing.id,
              financingTitle: financing.title,
              notes: 'Financing record created for Brgy. Malabanban Norte project'
            }
          });
          auditLogsCreated++;
          
          // If not in draft, create a state change audit
          if (financing.approvalState !== 'draft') {
            // Get the submitted timestamp from approval history for consistency
            let stateChangeTimestamp = financeData.createdAt;
            if (financeData.approvalHistory && financeData.approvalHistory.length > 1) {
              stateChangeTimestamp = financeData.approvalHistory[1].timestamp;
            }
            
            const stateChangeAudit = await payload.create({
              collection: 'financing-audit-log',
              data: {
                timestamp: stateChangeTimestamp || new Date().toISOString(),
                user: creatorId,
                action: 'state_change',
                record: financing.id,
                financingTitle: financing.title,
                previousState: 'draft',
                newState: financing.approvalState,
                notes: `Status changed from draft to ${financing.approvalState} by Barangay Council`
              }
            });
            auditLogsCreated++;
          }
        }
      } catch (error) {
        logger.error(`Failed to create financing record`, error);
      }
    }

    logger.info(`Successfully created ${financingCreated} financing records and ${auditLogsCreated} audit logs`);
    return { financingCreated, auditLogsCreated, financingIds: generatedFinancingIds }; // Return created IDs
  } catch (error) {
    logger.error("Error in generateFinancing:", error);
    throw new Error(`Failed to generate financing data: ${error.message}`);
  }
}

// Helper function to create fallback financing items if AI generation fails
function createFallbackItems(count, fiscalYear, groupTitle) {
  const items = [];
  const year = fiscalYear || new Date().getFullYear();
  
  const operations = ['add', 'multiply'];
  const accountingPrefix = 'MBN-ACCT-';
  
  for (let i = 0; i < count; i++) {
    // Create appropriate item title based on group
    let title;
    if (groupTitle.toLowerCase().includes('material')) {
      title = i === 0 ? "Cement and Aggregates" : "Paint and Finishing";
    } else if (groupTitle.toLowerCase().includes('labor')) {
      title = i === 0 ? "Skilled Labor" : "General Labor";
    } else if (groupTitle.toLowerCase().includes('equipment')) {
      title = i === 0 ? "Equipment Rental" : "Tools Purchase";
    } else {
      title = `Item ${i+1}`;
    }
    
    // Generate a random value appropriate for barangay projects
    const amount = Math.floor(Math.random() * 40000) + 5000; // ₱5,000 - ₱45,000
    
    // Create the item
    items.push({
      number: i + 1,
      title: title,
      operation: operations[Math.floor(Math.random() * operations.length)],
      value: amount,
      accountCode: `${accountingPrefix}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
      fiscalPeriod: `Q${Math.floor(Math.random() * 4) + 1} ${year}`
    });
  }
  
  return { records: items };
}

// Helper function to create fallback financing records if AI generation completely fails
function createFallbackFinancingRecords(count, demographicYears) {
  const records = [];
  
  // Create some basic financing record templates
  const templates = [
    {
      title: "Basketball Court Repair - Brgy. Malabanban Norte",
      accountType: "capital",
      approvalState: "draft",
      fiscalYear: demographicYears[0] || new Date().getFullYear(),
      budgetedAmount: "₱75,000",
      description: "Repairs to the community basketball court in Purok 3"
    },
    {
      title: "Street Lighting Project - Brgy. Malabanban Norte",
      accountType: "operational",
      approvalState: "submitted",
      fiscalYear: demographicYears[1] || new Date().getFullYear(),
      budgetedAmount: "₱120,000",
      description: "Installation of solar street lights along main roads"
    },
    {
      title: "Drainage System Improvement - Brgy. Malabanban Norte",
      accountType: "capital",
      approvalState: "approved",
      fiscalYear: demographicYears[0] || new Date().getFullYear(),
      budgetedAmount: "₱200,000",
      description: "Improving drainage system to prevent flooding during rainy season"
    }
  ];
  
  // Generate requested number of records
  for (let i = 0; i < count; i++) {
    // Use templates in rotation
    const template = templates[i % templates.length];
    
    // Create a record with unique title
    records.push({
      ...template,
      title: `${template.title} ${i+1}`,
      budgetReferenceCode: `BRGY-MBN-${template.fiscalYear}-${(i+1).toString().padStart(3, '0')}`,
      departmentCode: `MBN-${['ENG', 'FIN', 'ADM'][i % 3]}-${(i+1).toString().padStart(2, '0')}`,
      authorizationReference: `Barangay Resolution No. ${i+1}, Series of ${template.fiscalYear}`,
      groupsCount: 2 // Will be used to generate groups later
    });
  }
  
  return records;
}

// ====================================
// Generate Projects Function
// ====================================
async function generateProjects(count, userIds, financingIds, demographicYears = []) {
  let projectsCreated = 0;
  const availableUserIds = [...userIds];
  const availableFinancingIds = financingIds ? [...financingIds].filter(id => id) : [];
  
  logger.info(`Starting project generation with ${availableFinancingIds.length} available financing IDs to link`);

  if (availableUserIds.length === 0) {
    logger.warn("No user IDs available for Project creation (createdBy field). Skipping project generation.");
    return 0;
  }

  try {
    logger.info(`Generating ${count} barangay-level projects for Brgy. Malabanban Norte`);
    const schema = schemas.projects;
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} barangay-level project records specifically for Brgy. Malabanban Norte, Candelaria, Quezon.
    
    Requirements:
    - ALL projects must be for BARANGAY-LEVEL initiatives (NOT municipal or provincial)
    - Always include "Brgy. Malabanban Norte" in titles and locations
    - Focus on realistic small-scale barangay projects such as:
      - Infrastructure: waiting sheds, basketball courts, pathways, drainage systems, street lights
      - Events: barangay fiesta, sports tournaments, cleanup drives, health missions
      - Programs: livelihood training, health screenings, waste management campaigns
      - Initiatives: senior citizen programs, youth council activities, disaster preparedness
    - Consider that these projects would typically be funded by small to medium barangay budgets. Ensure project scopes are appropriate.
    
    - Vary project types: event, infrastructure, program, initiative, other
    - Vary project statuses: planning, ongoing, completed, on_hold, cancelled
    - Dates (startDate, endDate) should be realistic, within the past 3 years or near future
    - Locations must all be within Brgy. Malabanban Norte (specific areas, streets, facilities)
    - Include Filipino project lead names with appropriate barangay titles/roles
    - Include 1-5 team members with barangay-appropriate roles (kagawad, tanod, secretary, etc.)
    
    - For 'event' type: include expectedAttendees (50-500), actualAttendees (slightly less), and attendeeNotes
    - For 'infrastructure' type: include local contractor names and completionPercentage (0-100)
    - For 'program' type: include targetBeneficiaries (specific sectors of Malabanban Norte) and keyPerformanceIndicators
    
    Return the data as structured JSON matching the specified schema. Do not include createdBy or relatedFinancing fields.`;

    logger.debug("Sending project prompt to Gemini:", { prompt: sanitizeForPrompt(prompt) });

    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    const response = result.response;
    logger.debug("Received project response from Gemini API");

    const data = response.text();
    let projectsData;
    try {
      projectsData = safeJsonParse(data, 'projectsData');
      logger.debug("Successfully parsed JSON response for projects");
      if (!projectsData.records || !Array.isArray(projectsData.records)) {
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          projectsData = { records: safeJsonParse(arrayMatch[0], 'projectsArrayFallback') };
          logger.debug("Used fallback array extraction for projects", { count: projectsData.records.length });
        }
        if (!projectsData.records || !Array.isArray(projectsData.records)) {
          throw new Error("Project response missing records array");
        }
      }
      logger.info(`Parsed ${projectsData.records.length} project records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response for projects", error);
      logger.debug("Raw project response", { rawData: data });
      throw new Error(`Failed to parse structured output for projects: ${error.message}`);
    }

    for (const projectData of projectsData.records) {
      try {
        // Assign a random creator User ID
        const creatorId = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
        projectData.createdBy = creatorId;

        // Optionally assign a random related Financing ID - increased probability to 90%
        if (availableFinancingIds.length > 0 && Math.random() < 0.9) { // Increased from 0.7 to 0.9
          const financingId = availableFinancingIds[Math.floor(Math.random() * availableFinancingIds.length)];
          projectData.relatedFinancing = financingId;
          logger.debug(`Linking project '${projectData.title}' to financing ID: ${financingId}`);
        }

        // Ensure conditional fields match project type (AI might hallucinate)
        const projectType = projectData.projectType;
        if (projectType !== 'event') delete projectData.eventDetails;
        if (projectType !== 'infrastructure') delete projectData.infrastructureDetails;
        if (projectType !== 'program') delete projectData.programDetails;
        
        // Ensure "Brgy. Malabanban Norte" is in the title if not already
        if (projectData.title && !projectData.title.includes("Malabanban Norte")) {
          projectData.title = `${projectData.title} - Brgy. Malabanban Norte`;
        }
        
        // Ensure location contains Malabanban Norte
        if (projectData.location && !projectData.location.includes("Malabanban Norte")) {
          projectData.location = `${projectData.location}, Brgy. Malabanban Norte, Candelaria, Quezon`;
        } else if (!projectData.location) {
          // Generate a realistic location within Malabanban Norte
          const locations = [
            "Basketball Court, Purok 1, Brgy. Malabanban Norte",
            "Barangay Hall, Brgy. Malabanban Norte",
            "Health Center, Brgy. Malabanban Norte",
            "Elementary School, Brgy. Malabanban Norte",
            "Daycare Center, Brgy. Malabanban Norte",
            "Covered Court, Brgy. Malabanban Norte",
            "Multi-purpose Hall, Brgy. Malabanban Norte",
            "Purok 2 Plaza, Brgy. Malabanban Norte",
            "Sampaguita Street, Brgy. Malabanban Norte",
            "Ilang-Ilang Road, Brgy. Malabanban Norte"
          ];
          projectData.location = locations[Math.floor(Math.random() * locations.length)];
        }
        
        // Add realistic project details based on type
        if (projectType === 'event' && projectData.eventDetails) {
          // Ensure realistic event attendee numbers for a barangay
          if (projectData.eventDetails.expectedAttendees > 1000) {
            projectData.eventDetails.expectedAttendees = Math.floor(Math.random() * 450) + 50; // 50-500 people
          }
          
          if (projectData.eventDetails.actualAttendees > projectData.eventDetails.expectedAttendees) {
            projectData.eventDetails.actualAttendees = Math.floor(projectData.eventDetails.expectedAttendees * (0.7 + Math.random() * 0.3)); // 70-100% of expected
          }
        }
        
        if (projectType === 'infrastructure' && projectData.infrastructureDetails) {
          // Ensure contractor name has a local Filipino business style
          if (!projectData.infrastructureDetails.contractor || 
              projectData.infrastructureDetails.contractor.length < 3) {
            const contractors = [
              "Santos Construction Services",
              "Malabanban Builders",
              "De la Cruz Construction",
              "JARP Construction and Supply",
              "Reyes Brothers Construction",
              "Malabanban Norte Development Cooperative",
              "Barangay Construction Team",
              "Quezon Builders Association"
            ];
            projectData.infrastructureDetails.contractor = contractors[Math.floor(Math.random() * contractors.length)];
          }
        }
        
        if (projectType === 'program' && projectData.programDetails) {
          // Ensure target beneficiaries are specific to barangay context
          if (!projectData.programDetails.targetBeneficiaries ||
              projectData.programDetails.targetBeneficiaries.length < 5) {
            const beneficiaries = [
              "Senior citizens of Brgy. Malabanban Norte",
              "Youth aged 15-24 in Purok 1-5 of Malabanban Norte",
              "Families below poverty line in Brgy. Malabanban Norte",
              "Small-scale farmers in Brgy. Malabanban Norte",
              "PWDs residing in Brgy. Malabanban Norte",
              "Women's group in Brgy. Malabanban Norte",
              "Out-of-school youth in Brgy. Malabanban Norte",
              "Indigenous families in Brgy. Malabanban Norte"
            ];
            projectData.programDetails.targetBeneficiaries = beneficiaries[Math.floor(Math.random() * beneficiaries.length)];
          }
        }
        
        // Apply distributed dates if available
        if (demographicYears.length > 0) {
          // Project created date - evenly distribute among demographic years
          projectData.createdAt = getDistributedDate(demographicYears);
          
          const creationDate = new Date(projectData.createdAt);
          
          // Set start date - should be after creation date
          if (projectData.startDate) {
            let startDate;
            // For planning/ongoing projects, start date could be in future (30-90 days after creation)
            if (projectData.status === 'planning') {
              startDate = new Date(creationDate);
              startDate.setDate(startDate.getDate() + 30 + Math.floor(Math.random() * 60));
            } 
            // For ongoing/completed/on_hold/cancelled, start date should be in past (after creation)
            else {
              // Start date between 7-60 days after creation
              startDate = new Date(creationDate);
              startDate.setDate(startDate.getDate() + 7 + Math.floor(Math.random() * 53));
            }
            projectData.startDate = startDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }
          
          // Set end date - should be after start date
          if (projectData.endDate && projectData.startDate) {
            const startDate = new Date(projectData.startDate);
            let endDate;
            
            // For completed projects, end date is in the past
            if (projectData.status === 'completed') {
              // End date between 30-365 days after start
              endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + 30 + Math.floor(Math.random() * 335));
              // Ensure end date isn't in future
              const now = new Date();
              if (endDate > now) {
                endDate = now;
              }
            }
            // For ongoing/planning projects, end date is in future
            else if (projectData.status === 'planning' || projectData.status === 'ongoing') {
              // End date between 90-365 days after start
              endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + 90 + Math.floor(Math.random() * 275));
            }
            // For on_hold/cancelled, end date could be anywhere after start
            else {
              // End date between 14-180 days after start
              endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + 14 + Math.floor(Math.random() * 166));
            }
            
            projectData.endDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }
          
          logger.debug("Using distributed dates for project", {
            title: projectData.title,
            createdAt: projectData.createdAt,
            startDate: projectData.startDate,
            endDate: projectData.endDate
          });
        }

        logger.debug("Creating project record", { title: projectData.title, type: projectType });

        const project = await payload.create({
          collection: 'projects',
          data: projectData
        });
        // console.log("Payload Project: ", project);
        projectsCreated++;
        logger.debug("Created project record", { id: project.id, count: projectsCreated });
      } catch (error) {
        logger.error(`Failed to create project record for '${projectData.title}'`, error);
        // Log problematic data
        logger.debug('Problematic project data:', projectData);
      }
    }

    logger.info(`Successfully created ${projectsCreated} project records`);
    return projectsCreated;
  } catch (error) {
    logger.error("Error in generateProjects:", error);
    throw new Error(`Failed to generate project data: ${error.message}`);
  }
}

// ====================================
// Generate Demographics Function
// ====================================
async function generateDemographics(count, userIds) {
  let demographicsCreated = 0;
  const availableUserIds = [...userIds];

  if (availableUserIds.length === 0) {
    logger.warn("No user IDs available for Demographics creation (submittedBy field). Skipping demographics generation.");
    return 0;
  }

  try {
    logger.info(`Generating ${count} annual Filipino demographic records`);
    const schema = schemas.demographics;
    const structuredModel = createStructuredModel(schema);

    // Generate unique years for the demographic entries
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < count; i++) {
      years.push(currentYear - i);
    }
    logger.debug(`Using years for demographics: ${years.join(', ')}`);

    const prompt = `Generate ${count} annual demographic records for a Filipino barangay, one for each year: ${years.join(', ')}.

    Each record in the main JSON array must follow this structure accurately:
    {
        "year": (JSON number, e.g., 2022),
        "maleCount": (JSON number, e.g., 1250),
        "femaleCount": (JSON number, e.g., 1300),
        "householdsCount": (JSON number, e.g., 600),
        "voterCount": (JSON number, e.g., 1400),
        "pwdCount": (JSON number, e.g., 50),
        "ageGroups": [
            { "ageRange": "0-4", "count": (JSON number, e.g., 250) },
            { "ageRange": "5-9", "count": (JSON number, e.g., 280) },
            // ... (5 to 8 such entries total)
        ],
        "chronicDiseases": [
            { "diseaseName": "Hypertension", "count": (JSON number, e.g., 120) },
            { "diseaseName": "Diabetes", "count": (JSON number, e.g., 70) },
            // ... (3 to 5 such entries total)
        ]
    }

    Requirements:
    - For each record, set the 'year' field to one of the unique years provided: ${years.join(', ')}. Each year must be unique across the generated records.
    - Generate realistic population counts (maleCount, femaleCount) appropriate for a barangay (e.g., 500-5000 total combined), showing slight year-over-year changes. These MUST be JSON numbers.
    - Generate plausible counts for householdsCount, voterCount, pwdCount relative to the sum of maleCount and femaleCount. These MUST be JSON numbers.
    - Create 5 to 8 ageGroups entries per record. Each entry MUST be an object like {"ageRange": "string", "count": (JSON number)}. Counts should sum approximately to the total population for that year.
    - Create 3 to 5 chronicDiseases entries per record. Each entry MUST be an object like {"diseaseName": "string", "count": (JSON number)}.
    - IMPORTANT: Keep all text fields (like ageRange, diseaseName) SHORT and CONCISE.
    - Do NOT include 'totalPopulation' or 'submittedBy' fields in your response; these are handled separately.

    Return the data as a single JSON array of records matching the specified structure.`;

    logger.debug("Sending demographics prompt to Gemini");

    try {
      // Make the API call with structured output - with fallback to default implementation if it fails
      const result = await withTimeout(
        async () => {
          const response = await structuredModel.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 4000,
              temperature: 0.2
            }
          });
          return response.response.text();
        },
        20000, // 20 second timeout
        () => JSON.stringify(createFallbackDemographicRecords(count, years)),
        "demographics generation"
      );

      // Parse the response as JSON with our safer parsing method
      let demographicsData;
      try {
        // First try to find a JSON array in the response
        const arrayMatch = result.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          try {
            const arrayData = safeJsonParse(arrayMatch[0], 'demographicsArrayFallback');
            if (Array.isArray(arrayData)) {
              demographicsData = { records: arrayData };
              logger.debug("Used direct array extraction for demographics", { count: arrayData.length });
            }
          } catch (error) {
            logger.error("Failed to parse direct array match", error);
          }
        }
        
        // If direct array extraction failed, try the regular approach
        if (!demographicsData) {
          demographicsData = safeJsonParse(result, 'demographicsData');
          logger.debug("Successfully parsed JSON response for demographics");
        }
        
        // Verify we have the records array
        if (!demographicsData.records || !Array.isArray(demographicsData.records)) {
          // Try one more fallback approach - look for an array directly
          const arrayMatch = result.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (arrayMatch) {
            const arrayData = safeJsonParse(arrayMatch[0], 'demographicsArrayFallback');
            if (Array.isArray(arrayData)) {
              demographicsData = { records: arrayData };
              logger.debug("Used fallback array extraction for demographics", { count: arrayData.length });
            }
          }
          
          if (!demographicsData.records || !Array.isArray(demographicsData.records)) {
            demographicsData = { records: createFallbackDemographicRecords(count, years) };
            logger.warn("Response missing records array for demographics, using fallback data");
          }
        }
        logger.info(`Parsed ${demographicsData.records.length} demographic records from response`);
      } catch (error) {
        logger.error("Failed to parse JSON response for demographics", error);
        logger.debug("Raw response", { rawData: result.substring(0, 500) + "..." });
        demographicsData = { records: createFallbackDemographicRecords(count, years) };
        logger.warn("Using fallback demographic records due to parsing error");
      }

      // Create each record in PayloadCMS
      const usedYears = new Set();
      for (const demographicData of demographicsData.records) {
        try {
          // Assign a random submitter from available user IDs
          const submitterId = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
          demographicData.submittedBy = submitterId;

          // Ensure year is a number, not a string
          if (typeof demographicData.year === 'string') {
            demographicData.year = parseInt(demographicData.year.replace(/,/g, '').trim(), 10);
          }
          demographicData.year = Number(demographicData.year);

          // Validate year
          if (
            !Number.isFinite(demographicData.year) ||
            demographicData.year < 1900 ||
            demographicData.year > 2100 ||
            usedYears.has(demographicData.year)
          ) {
            logger.error('Skipping demographic record due to invalid or duplicate year', { year: demographicData.year, type: typeof demographicData.year });
            continue;
          }
          usedYears.add(demographicData.year);

          // Calculate totalPopulation if not provided
          if (!demographicData.totalPopulation && demographicData.maleCount && demographicData.femaleCount) {
            demographicData.totalPopulation = demographicData.maleCount + demographicData.femaleCount;
          }

          // Sanitize and validate ageGroups
          if (demographicData.ageGroups && Array.isArray(demographicData.ageGroups)) {
            demographicData.ageGroups = demographicData.ageGroups.map(group => {
              if (group.ageGroup && !group.ageRange) {
                group.ageRange = group.ageGroup;
                delete group.ageGroup;
              }
              if (typeof group.count === 'string') {
                group.count = parseInt(group.count.replace(/,/g, '').trim(), 10);
              }
              group.count = Number(group.count || 0);
              return { ageRange: group.ageRange, count: group.count };
            });
          }

          // Sanitize and validate chronicDiseases
          if (demographicData.chronicDiseases && Array.isArray(demographicData.chronicDiseases)) {
            demographicData.chronicDiseases = demographicData.chronicDiseases.map(disease => {
              if (disease.name && !disease.diseaseName) {
                disease.diseaseName = disease.name;
                delete disease.name;
              }
              if (typeof disease.count === 'string') {
                disease.count = parseInt(disease.count.replace(/,/g, '').trim(), 10);
              }
              disease.count = Number(disease.count || 0);
              return { diseaseName: disease.diseaseName, count: disease.count };
            });
          }

          // Make sure all numeric fields are actually numbers, not strings
          const numericFields = ['maleCount', 'femaleCount', 'totalPopulation', 'householdsCount', 'voterCount', 'pwdCount'];
          numericFields.forEach(field => {
            if (typeof demographicData[field] === 'string') {
              demographicData[field] = parseInt(demographicData[field].replace(/,/g, '').trim(), 10);
            }
            if (demographicData[field] !== undefined) {
              demographicData[field] = Number(demographicData[field]);
            }
          });

          // Only send allowed fields
          const allowed = [
            'year', 'maleCount', 'femaleCount', 'totalPopulation', 'householdsCount', 'voterCount', 'pwdCount', 'ageGroups', 'chronicDiseases', 'submittedBy'
          ];
          const cleanData = {};
          for (const key of allowed) {
            if (demographicData[key] !== undefined) cleanData[key] = demographicData[key];
          }

          logger.debug('Creating demographic record', { year: cleanData.year, type: typeof cleanData.year });

          const demographic = await payload.create({
            collection: 'demographics',
            data: cleanData
          });

          demographicsCreated++;
          logger.debug('Created demographic record', { id: demographic.id, year: demographic.year });
        } catch (error) {
          logger.error(`Failed to create demographic record for year ${demographicData.year}`, error);
        }
      }

      logger.info(`Successfully created ${demographicsCreated} demographic records`);
      return demographicsCreated;
    } catch (error) {
      logger.error("Error generating demographics with Gemini", error);
      
      // Fall back to creating records directly
      logger.info("Falling back to default demographic record generation");
      const fallbackRecords = createFallbackDemographicRecords(count, years);
      
      // Create each fallback record in PayloadCMS
      for (const demographicData of fallbackRecords) {
        try {
          // Assign a random submitter from available user IDs
          const submitterId = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
          demographicData.submittedBy = submitterId;
          
          logger.debug("Creating fallback demographic record", { year: demographicData.year });
          
          const demographic = await payload.create({
            collection: 'demographics',
            data: demographicData
          });
          
          demographicsCreated++;
          logger.debug("Created fallback demographic record", { id: demographic.id, year: demographic.year });
        } catch (error) {
          logger.error(`Failed to create fallback demographic record for year ${demographicData.year}`, error);
        }
      }
      
      logger.info(`Successfully created ${demographicsCreated} fallback demographic records`);
      return demographicsCreated;
    }
  } catch (error) {
    logger.error("Error in generateDemographics:", error);
    throw new Error(`Failed to generate demographic data: ${error.message}`);
  }
}

// Helper function to create fallback demographic records
function createFallbackDemographicRecords(count, years) {
  const records = [];
  
  for (let i = 0; i < count; i++) {
    // Determine which year to use for this record
    const year = Number(years[i] || (new Date().getFullYear() - i));
    
    // Use baseline population that grows slightly each year
    const basePopulation = Number(2500 + (years[0] - year) * 50); // Older years have lower population
    const maleFactor = 0.48 + Math.random() * 0.04; // 48-52% male
    const maleCount = Number(Math.floor(basePopulation * maleFactor));
    const femaleCount = Number(basePopulation - maleCount);
    
    // Create age groups
    const ageGroups = createDefaultAgeGroups(basePopulation);
    
    // Create chronic diseases
    const chronicDiseases = createDefaultChronicDiseases(basePopulation);
    
    // Create the record with explicit Number conversions
    records.push({
      year: Number(year),
      maleCount: Number(maleCount),
      femaleCount: Number(femaleCount),
      totalPopulation: Number(basePopulation),
      householdsCount: Number(Math.floor(basePopulation / 4.4)), // Average Filipino household size
      voterCount: Number(Math.floor(basePopulation * 0.65)), // 65% of population are voters
      pwdCount: Number(Math.floor(basePopulation * 0.015)), // 1.5% of population are PWDs
      ageGroups,
      chronicDiseases
    });
  }
  
  return records;
}

// Helper function to create default age groups
function createDefaultAgeGroups(totalPopulation) {
  const ageGroups = [
    { ageRange: "0-4", percentage: 0.09 },
    { ageRange: "5-9", percentage: 0.10 },
    { ageRange: "10-14", percentage: 0.10 },
    { ageRange: "15-19", percentage: 0.10 },
    { ageRange: "20-24", percentage: 0.09 },
    { ageRange: "25-29", percentage: 0.08 },
    { ageRange: "30-34", percentage: 0.07 },
    { ageRange: "35-39", percentage: 0.07 },
    { ageRange: "40-44", percentage: 0.06 },
    { ageRange: "45-49", percentage: 0.06 },
    { ageRange: "50-54", percentage: 0.05 },
    { ageRange: "55-59", percentage: 0.05 },
    { ageRange: "60-64", percentage: 0.04 },
    { ageRange: "65+", percentage: 0.04 }
  ];
  
  // Apply some random variation to percentages
  let totalPercentage = 0;
  for (const group of ageGroups) {
    // Add ±20% variation to each percentage
    const variation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    group.percentage = group.percentage * variation;
    totalPercentage += group.percentage;
  }
  
  // Normalize percentages to sum to 1
  for (const group of ageGroups) {
    group.percentage = group.percentage / totalPercentage;
    group.count = Number(Math.floor(totalPopulation * group.percentage));
    delete group.percentage; // Remove percentage as it's not in the schema
  }
  
  return ageGroups;
}

// Helper function to create default chronic diseases
function createDefaultChronicDiseases(totalPopulation) {
  const diseases = [
    { diseaseName: "Hypertension", percentage: 0.22 },
    { diseaseName: "Diabetes", percentage: 0.07 },
    { diseaseName: "Heart Disease", percentage: 0.04 },
    { diseaseName: "Asthma", percentage: 0.05 },
    { diseaseName: "Arthritis", percentage: 0.06 }
  ];
  
  // Apply some random variation
  for (const disease of diseases) {
    // Add ±30% variation to each percentage
    const variation = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
    disease.percentage = disease.percentage * variation;
    disease.count = Number(Math.floor(totalPopulation * disease.percentage));
    delete disease.percentage; // Remove percentage as it's not in the schema
  }
  
  return diseases;
}