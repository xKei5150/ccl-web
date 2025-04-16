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
  }
};

// Utility to get user IDs (either generated or fetched)
async function getUserIds(count, providedUserIds, shouldGenerateUsers) {
  if (shouldGenerateUsers) {
    // Generate new users
    logger.info("Beginning user generation");
    const userIds = await generateUsers(count, providedUserIds); // Assuming providedUserIds are personalInfoIds
    logger.info(`Generated ${userIds.length} user records`);
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

export async function generateMockData(count = 50, options = {}) {
  const { 
    generateUsersFlag = true, // Default to generating users
    collectionsToGenerate = null // Default to all, null means generate all
  } = options;

  const shouldGenerate = (collectionSlug) => 
    !collectionsToGenerate || collectionsToGenerate.includes(collectionSlug);

  logger.info(`Starting mock data generation for ${count} records per collection`, { generateUsersFlag, collectionsToGenerate });
  const stats = {};
  let personalInfoIds = [];
  let userIds = [];
  let financingIds = [];

  try {
    // Generate Personal Information first (required for relationships)
    if (shouldGenerate('personal-information')) {
      logger.info("Beginning personal information generation");
      personalInfoIds = await generatePersonalInformation(count);
      logger.info(`Generated ${personalInfoIds.length} personal information records`);
      stats.personalInfo = personalInfoIds.length;
    } else {
      logger.info("Skipping personal information generation based on options.");
       // Fetch existing personal info if needed for relationships later
      const { docs: existingPersonalInfo } = await payload.find({ collection: 'personal-information', limit: count * 2, depth: 0 });
      personalInfoIds = existingPersonalInfo.map(p => p.id);
      logger.info(`Using ${personalInfoIds.length} existing personal information IDs.`);
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
    
    // Generate Financing records (needed for Projects relationship)
    if (shouldGenerate('financing')) {
      logger.info("Beginning financing generation");
      const financingResult = await generateFinancing(Math.floor(count / 2), userIds);
      financingIds = financingResult.financingIds;
      stats.financing = financingResult.financingCreated;
      stats.financingAuditLog = financingResult.auditLogsCreated;
      logger.info(`Generated ${stats.financing} financing records and ${stats.financingAuditLog} audit logs`);
    } else {
        logger.info("Skipping financing generation based on options.");
        // Fetch existing financing IDs if needed for projects
        const { docs: existingFinancing } = await payload.find({ collection: 'financing', limit: count, depth: 0 });
        financingIds = existingFinancing.map(f => f.id);
        logger.info(`Using ${financingIds.length} existing financing IDs.`);
    }

    // Generate Posts
    if (shouldGenerate('posts')) {
      logger.info("Beginning post generation");
      const postsCount = await generatePosts(count, userIds);
      logger.info(`Generated ${postsCount} post records`);
      stats.posts = postsCount;
    } else {
      logger.info("Skipping posts generation based on options.");
    }
    
    // Generate Households
    if (shouldGenerate('households') && personalInfoIds.length > 0) {
      logger.info("Beginning household generation");
      const householdsCount = await generateHouseholds(Math.floor(count / 3), personalInfoIds);
      logger.info(`Generated ${householdsCount} household records`);
      stats.households = householdsCount;
    } else {
      logger.info(`Skipping households generation ${personalInfoIds.length === 0 ? ' (no personal info IDs available)' : 'based on options'}.`);
    }
    
    // Generate Businesses & Permits
    if (shouldGenerate('business')) {
      logger.info("Beginning business generation");
      const businessResult = await generateBusinesses(count);
      stats.businesses = businessResult.businessesCreated;
      stats.businessPermits = businessResult.permitsCreated;
      logger.info(`Generated ${stats.businesses} business records and ${stats.businessPermits} permits`);
    } else {
      logger.info("Skipping business generation based on options.");
    }
    
    // Generate Reports
    if (shouldGenerate('reports')) {
      logger.info("Beginning report generation");
      const reportsCount = await generateReports(count, userIds); // Pass userIds for submitter
      logger.info(`Generated ${reportsCount} report records`);
      stats.reports = reportsCount;
    } else {
      logger.info("Skipping report generation based on options.");
    }
    
    // Generate Requests
    if (shouldGenerate('requests') && personalInfoIds.length > 0) {
      logger.info("Beginning request generation");
      const requestsCount = await generateRequests(count, personalInfoIds);
      logger.info(`Generated ${requestsCount} request records`);
      stats.requests = requestsCount;
    } else {
      logger.info(`Skipping requests generation ${personalInfoIds.length === 0 ? ' (no personal info IDs available)' : 'based on options'}.`);
    }

    // Generate Projects
    if (shouldGenerate('projects')) {
        logger.info("Beginning project generation");
        const projectsCount = await generateProjects(count, userIds, financingIds);
        logger.info(`Generated ${projectsCount} project records`);
        stats.projects = projectsCount;
    } else {
        logger.info("Skipping project generation based on options.");
    }

    // Generate Demographics
    if (shouldGenerate('demographics')) {
        logger.info("Beginning demographics generation");
        const demographicsCount = await generateDemographics(Math.floor(count / 10), userIds); // Generate fewer demographic entries (e.g., per year)
        logger.info(`Generated ${demographicsCount} demographic records`);
        stats.demographics = demographicsCount;
    } else {
        logger.info("Skipping demographics generation based on options.");
    }
    
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

async function generatePersonalInformation(count) {
  const generatedIds = [];
  
  try {
    logger.info(`Generating ${count} Filipino personal information records`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.personalInfo;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);
    
    const prompt = `Generate ${count} Filipino personal information records for a database.
    
    Requirements:
    - Use Filipino names (first, middle, and last names)
    - Include realistic Filipino addresses with barangays, municipalities/cities, and provinces
    - Email addresses should be realistic and appropriate for each person
    - Birth dates should be between 1950 and 2005 in YYYY-MM-DD format
    - Set lifeStatus to "alive" for all records
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });
    
    // Make the API call with structured output
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = result.response;
    logger.debug("Received response from Gemini API");
    
    // Check if we got a valid response
    if (!response) {
      throw new Error("No response received from Gemini API");
    }
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    logger.debug("Response text received", { 
      dataLength: data.length,
      dataSample: data.substring(0, 100) + "..." 
    });
    
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
    
    // Create each record in PayloadCMS
    for (const personData of personalInfoData.records) {
      try {
        logger.debug("Creating personal info record", { 
          firstName: personData.name.firstName,
          lastName: personData.name.lastName 
        });
        
        const person = await payload.create({
          collection: 'personal-information',
          data: personData
        });
        console.log("Payload Person: ", person);
        generatedIds.push(person.id);
        logger.debug("Created personal info record", { id: person.id });
      } catch (error) {
        logger.error(`Failed to create personal info record for ${personData.name?.firstName || 'unknown'}`, error);
      }
    }

    logger.info(`Successfully created ${generatedIds.length} personal information records`);
    return generatedIds;
  } catch (error) {
    logger.error("Error in generatePersonalInformation:", error);
    throw new Error(`Failed to generate personal information data: ${error.message}`);
  }
}

async function generateUsers(count, personalInfoIds) {
  const generatedUserIds = [];

  try {
    logger.info(`Generating ${count} Filipino user records`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.users;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} Filipino user records for a database.
    
    Requirements:
    - Use Filipino-style email addresses that might include common Filipino names
    - Password should be set to "Password123!" for all users
    - Make most users (80%) citizens, with 10% staff and 10% admin
    - Make 90% of users active
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });
    
    // Make the API call with structured output
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = await result.response;
    logger.debug("Received response from Gemini API");
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let usersData;
    try {
      usersData = safeJsonParse(data, 'usersData');
      logger.debug("Successfully parsed JSON response");
      
      // Verify we have the records array
      if (!usersData.records || !Array.isArray(usersData.records)) {
        // Try one more fallback approach - look for an array directly
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'usersArrayFallback');
          if (Array.isArray(arrayData)) {
            usersData = { records: arrayData };
            logger.debug("Used fallback array extraction", { count: arrayData.length });
          }
        }
        
        if (!usersData.records || !Array.isArray(usersData.records)) {
          throw new Error("Response missing records array");
        }
      }
      logger.info(`Parsed ${usersData.records.length} user records from response`);
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
        
        logger.debug("Creating user record", { email: userData.email, role: userData.role });
        
        const user = await payload.create({
          collection: 'users',
          data: userData
        });
        console.log("Payload User: ", user);
        generatedUserIds.push(user.id);
        logger.debug("Created user record", { id: user.id });
      } catch (error) {
        logger.error(`Failed to create user record`, error);
      }
    }

    logger.info(`Successfully created ${generatedUserIds.length} user records`);
    return generatedUserIds;
  } catch (error) {
    logger.error("Error in generateUsers:", error);
    throw new Error(`Failed to generate user data: ${error.message}`);
  }
}

async function generatePosts(count, userIds) {
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

    logger.debug("Sending prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });
    
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
        
        logger.debug("Creating post record", { title: postData.title });
        
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

async function generateHouseholds(count, personalInfoIds) {
  let householdsCreated = 0;
  
  try {
    logger.info(`Generating ${count} Filipino household records`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.households;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} household records for Filipino families.
    
    Requirements:
    - Use common Filipino family names like Santos, Cruz, Reyes, Garcia, etc.
    - Include realistic Filipino addresses with barangays, municipalities/cities, and provinces
    - Make all households active
    - Set residency dates within the past 10 years in ISO format (YYYY-MM-DDTHH:MM:SS.sssZ)
    - Set member counts between 1 and 6 people per household
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });
    
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
    
    // Create each record in PayloadCMS
    for (const householdData of householdsData.records) {
      try {
        // Create members array from available personal info IDs
        const memberCount = householdData.memberCount;
        delete householdData.memberCount;
        
        // Randomly select member IDs from the personal info IDs
        const availableIds = [...personalInfoIds];
        const members = [];
        
        for (let i = 0; i < memberCount && availableIds.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * availableIds.length);
          const memberId = availableIds.splice(randomIndex, 1)[0];
          members.push({ member: memberId });
        }
        
        householdData.members = members;
        
        logger.debug("Creating household record", { familyName: householdData.familyName });
        
        const household = await payload.create({
          collection: 'households',
          data: householdData
        });
        console.log("Payload Household: ", household);
        
        householdsCreated++;
        logger.debug("Created household record", { id: household.id });
      } catch (error) {
        logger.error(`Failed to create household record`, error);
      }
    }

    logger.info(`Successfully created ${householdsCreated} household records`);
    return householdsCreated;
  } catch (error) {
    logger.error("Error in generateHouseholds:", error);
    throw new Error(`Failed to generate household data: ${error.message}`);
  }
}

async function generateBusinesses(count) {
  let businessesCreated = 0;
  let permitsCreated = 0;
  
  try {
    logger.info(`Generating ${count} Filipino business records`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.business;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} business records for Filipino businesses.
    
    Requirements:
    - Use Filipino-style business names (like sari-sari stores, carinderias, eateries, etc.)
    - Include realistic Filipino addresses with barangays and cities
    - Registration dates should be within the past 5 years in ISO format
    - Set 70% as active, 20% as inactive, and 10% as pending
    - Type of ownership should vary appropriately among sole proprietorship, partnership, corporation, and llc
    - Use Filipino full names for owners
    - Use Philippines mobile numbers (+63 format)
    - Include appropriate email addresses for each business
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });
    
    // Make the API call with structured output
    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = result.response;
    logger.debug("Received response from Gemini API");
    
    // Use the structured output (should be parsed JSON)
    const data = response.text();
    
    // Parse the response as JSON with our safer parsing method
    let businessesData;
    try {
      businessesData = safeJsonParse(data, 'businessesData');
      logger.debug("Successfully parsed JSON response");
      
      // Verify we have the records array
      if (!businessesData.records || !Array.isArray(businessesData.records)) {
        // Try one more fallback approach - look for an array directly
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'businessesArrayFallback');
          if (Array.isArray(arrayData)) {
            businessesData = { records: arrayData };
            logger.debug("Used fallback array extraction", { count: arrayData.length });
          }
        }
        
        if (!businessesData.records || !Array.isArray(businessesData.records)) {
          throw new Error("Response missing records array");
        }
      }
      logger.info(`Parsed ${businessesData.records.length} business records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response", { rawData: data });
      throw new Error(`Failed to parse structured output: ${error.message}`);
    }
    
    // Create each record in PayloadCMS
    for (const businessData of businessesData.records) {
      try {
        logger.debug("Creating business record", { businessName: businessData.businessName });
        
        const business = await payload.create({
          collection: 'business',
          data: businessData
        });
        console.log("Payload Business: ", business);
        
        businessesCreated++;
        logger.debug("Created business record", { id: business.id });

        // Generate a business permit for each active business
        if (business.status === 'active') {
          const permitSchema = schemas.businessPermit;
          const permitModel = createStructuredModel(permitSchema);
          
          const permitPrompt = `Generate a Filipino business permit record for "${business.businessName}".
          
          Requirements:
          - Validity should be a future date within 1 year in ISO format
          - Create a plausible official receipt number (alphanumeric)
          - Set issuedTo to "${business.owners[0].ownerName}"
          - Amount should be between 1000 and 10000 pesos
          - Payment date should be within past 6 months in ISO format
          - Set status to "approved"
          
          Return the data as structured JSON matching the specified schema.`;

          logger.debug("Sending permit prompt to Gemini");
          
          const permitResult = await permitModel.generateContent({
            contents: [{ role: "user", parts: [{ text: permitPrompt }] }]
          });
          
          const permitResponse = permitResult.response;
          const permitData = permitResponse.text();
          
          try {
            const parsedPermitData = safeJsonParse(permitData, 'businessPermit');
            // Add the business relationship
            parsedPermitData.business = business.id;
            
            const permit = await payload.create({
              collection: 'business-permits',
              data: parsedPermitData
            });
            console.log("Payload Business Permit: ", permit);
            
            permitsCreated++;
            logger.debug("Created business permit", { id: permit.id });
          } catch (permitError) {
            logger.error(`Failed to create business permit`, permitError);
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

async function generateReports(count, userIds) {
  let reportsCreated = 0;
  
  try {
    const headerList = await headers();
    const { user } = await payload.auth({ headers: headerList });
    const submitterUserId = user?.id;
    
    logger.info(`Generating ${count} Filipino incident reports`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.reports;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} incident reports for a Filipino barangay.
    
    Requirements:
    - Include titles that clearly describe common community incidents
    - Dates should be within the past 6 months in ISO format
    - Descriptions should be detailed and include some Tagalog phrases where appropriate
    - Locations should be specific Filipino addresses including barangay details
    - Each report should have 1-3 involved persons with appropriate roles (complainant, respondent, witness)
    - Make statements realistic and relevant to the incident
    - Status distribution: 50% open, 30% inProgress, 20% closed
    - Include incidents like noise complaints from karaoke, property disputes, etc.
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });
    
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
        reportData.submittedBy = submitterUserId || "undefined";
        
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

async function generateRequests(count, personalInfoIds) {
  let requestsCreated = 0;
  
  try {
    logger.info(`Generating ${count} Filipino document requests`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.requests;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} document requests for a Filipino barangay office.
    
    Requirements:
    - Include different request types: indigencyCertificate, barangayClearance, and barangayResidency
    - Purposes should relate to Filipino needs (job applications, scholarship requirements, PhilHealth, etc.)
    - Status distribution: 40% pending, 25% processing, 20% approved, 5% rejected, 10% completed
    - Additional information should include:
      - forWhom: The Filipino person's name the document is for
      - remarks: Any special notes about the request
      - duration: Usually "6 months" for validity period
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });
    
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
        requestData.person = personalInfoIds[Math.floor(Math.random() * personalInfoIds.length)];
        
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

async function generateFinancing(count, userIds) {
  let financingCreated = 0;
  let auditLogsCreated = 0;
  const generatedFinancingIds = []; // Keep track of created IDs
  const availableUserIds = [...userIds];

  if (availableUserIds.length === 0) {
    logger.warn("No user IDs available for Financing creation (createdBy field). Skipping financing generation.");
    return { financingCreated: 0, auditLogsCreated: 0, financingIds: [] };
  }
  
  try {
    logger.info(`Generating ${count} Filipino government financing records`);
    
    // Use the schema from our schemas.js file
    const schema = schemas.financing;
    
    // Create structured model
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} Filipino government financing records.
    
    Requirements:
    - Create titles relevant to Filipino barangay or municipal projects
    - Include detailed descriptions in Filipino context
    - Distribution of approval states: 30% draft, 20% submitted, 20% under_review, 20% approved, 10% rejected
    - Account types should vary among: capital, operational, grant, revenue, transfer
    - Include fiscal years between 2020-2024
    - Budgeted amounts should range from 10,000 to 10,000,000 pesos
    - Include appropriate budget reference codes and department codes
    - Include justifications relevant to Filipino government context
    - Authorization references should refer to Filipino legislation or policies
    - Each record should have 1-3 calculation groups (set as groupsCount)
    
    Return the data as structured JSON matching the specified schema.`;

    logger.debug("Sending prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });
    
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
      financingData = safeJsonParse(data, 'financingData');
      logger.debug("Successfully parsed JSON response");
      
      // Verify we have the records array
      if (!financingData.records || !Array.isArray(financingData.records)) {
        // Try one more fallback approach - look for an array directly
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          const arrayData = safeJsonParse(arrayMatch[0], 'financingArrayFallback');
          if (Array.isArray(arrayData)) {
            financingData = { records: arrayData };
            logger.debug("Used fallback array extraction", { count: arrayData.length });
          }
        }
        
        if (!financingData.records || !Array.isArray(financingData.records)) {
          throw new Error("Response missing records array");
        }
      }
      logger.info(`Parsed ${financingData.records.length} financing records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response", error);
      logger.debug("Raw response", { rawData: data });
      throw new Error(`Failed to parse structured output: ${error.message}`);
    }
    
    // Create each record in PayloadCMS
    for (const financeData of financingData.records) {
      try {
        // Assign a random creator from available user IDs (admin or staff only)
        const creatorId = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
        
        // Extract and remove groupsCount from data
        const groupsCount = financeData.groupsCount || 1;
        delete financeData.groupsCount;
        
        // Generate groups and items
        const groupsSchema = schemas.financingGroups;
        const groupsModel = createStructuredModel(groupsSchema);
        
        const groupsPrompt = `Generate ${groupsCount} calculation groups for a Filipino government financing project titled "${financeData.title}".
        
        Requirements:
        - Create groups relevant to Filipino government budgeting and finance
        - Each group should have a title and optional description
        - Subtotal operations should be one of: sum, average, min, max
        - Each group should have 2-5 items (specified as itemsCount)
        
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
          groupsData = safeJsonParse(groupsText, 'financingGroups');
          
          if (!groupsData.records || !Array.isArray(groupsData.records)) {
            const arrayMatch = groupsText.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (arrayMatch) {
              groupsData = { records: safeJsonParse(arrayMatch[0], 'groupsArrayFallback') };
            } else {
              groupsData = { records: [] };
            }
          }
        } catch (error) {
          logger.error("Failed to parse groups data", error);
          groupsData = { records: [] };
        }
        
        // Process each group and generate items
        const groups = [];
        
        for (const groupData of groupsData.records) {
          // Generate items for this group
          const itemsSchema = schemas.financingItems;
          const itemsModel = createStructuredModel(itemsSchema);
          const itemsCount = groupData.itemsCount || 3;
          delete groupData.itemsCount;
          
          const itemsPrompt = `Generate ${itemsCount} calculation items for a Filipino government financing group titled "${groupData.title}".
          
          Requirements:
          - Create numbered items (1, 2, 3, etc.)
          - Titles should be relevant to Filipino government spending categories
          - Values should be between 1,000 and 1,000,000 pesos
          - Operations should vary among: add, subtract, multiply, divide
          - Include relevant Filipino government accounting codes
          - Fiscal periods should be quarters like Q1 2023, Q2 2023, etc.
          
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
            itemsData = safeJsonParse(itemsText, 'financingItems');
            
            if (!itemsData.records || !Array.isArray(itemsData.records)) {
              const arrayMatch = itemsText.match(/\[\s*\{[\s\S]*\}\s*\]/);
              if (arrayMatch) {
                itemsData = { records: safeJsonParse(arrayMatch[0], 'itemsArrayFallback') };
              } else {
                itemsData = { records: [] };
              }
            }
          } catch (error) {
            logger.error("Failed to parse items data", error);
            itemsData = { records: [] };
          }
          
          groupData.items = itemsData.records;
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
          
          // Generate appropriate history
          for (let i = 0; i <= currentStatusIndex; i++) {
            const daysAgo = (currentStatusIndex - i) * 7; // Each step is 7 days apart
            const timestamp = new Date();
            timestamp.setDate(timestamp.getDate() - daysAgo);
            
            approvalHistory.push({
              state: statuses[i],
              timestamp: timestamp.toISOString(),
              user: "Finance Officer", // Simplified
              notes: i === 0 ? "Initial draft created" : 
                     i === 1 ? "Submitted for review" :
                     i === 2 ? "Under review by committee" :
                     i === 3 ? "Approved by finance committee" :
                     "Rejected due to budget constraints"
            });
          }
          
          financeData.approvalHistory = approvalHistory;
        }
        
        logger.debug("Creating financing record", { title: financeData.title });
        
        const financing = await payload.create({
          collection: 'financing',
          data: financeData
        });
        console.log("Payload Financing: ", financing);
        
        financingCreated++;
        logger.debug("Created financing record", { id: financing.id });
        generatedFinancingIds.push(financing.id); // Store the ID
        
        // Generate corresponding audit log entries
        if (financing.id) {
          // Create an audit log entry for the creation
          const creationAudit = await payload.create({
            collection: 'financing-audit-log',
            data: {
              timestamp: new Date().toISOString(),
              user: creatorId,
              action: 'create',
              record: financing.id,
              financingTitle: financing.title,
              notes: 'Financing record created'
            }
          });
          auditLogsCreated++;
          
          // If not in draft, create a state change audit
          if (financing.approvalState !== 'draft') {
            const stateChangeAudit = await payload.create({
              collection: 'financing-audit-log',
              data: {
                timestamp: new Date().toISOString(),
                user: creatorId,
                action: 'state_change',
                record: financing.id,
                financingTitle: financing.title,
                previousState: 'draft',
                newState: financing.approvalState,
                notes: `Status changed from draft to ${financing.approvalState}`
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

// ====================================
// Generate Projects Function
// ====================================
async function generateProjects(count, userIds, financingIds) {
  let projectsCreated = 0;
  const availableUserIds = [...userIds];
  const availableFinancingIds = [...financingIds];

  if (availableUserIds.length === 0) {
    logger.warn("No user IDs available for Project creation (createdBy field). Skipping project generation.");
    return 0;
  }

  try {
    logger.info(`Generating ${count} Filipino project records`);
    const schema = schemas.projects;
    const structuredModel = createStructuredModel(schema);

    const prompt = `Generate ${count} project records for a Filipino barangay or municipality.
    
    Requirements:
    - Titles should be relevant to local Filipino projects (events, infrastructure, community programs, etc.).
    - Descriptions should provide brief context.
    - Vary project types: event, infrastructure, program, initiative, other.
    - Vary project statuses: planning, ongoing, completed, on_hold, cancelled.
    - Dates (startDate, endDate) should be realistic, within the past 3 years or near future, in YYYY-MM-DD format.
    - Locations should be plausible Filipino barangay/municipal locations.
    - Include a Filipino project lead name.
    - Include 1-5 team members with names and simple roles.
    - For 'event' type: include expectedAttendees (50-500), actualAttendees (slightly less than expected), and attendeeNotes (short note).
    - For 'infrastructure' type: include contractor name and completionPercentage (0-100).
    - For 'program' type: include targetBeneficiaries (description) and keyPerformanceIndicators (description).
    
    Return the data as structured JSON matching the specified schema. Do not include createdBy or relatedFinancing fields.`;

    logger.debug("Sending project prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });

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

        // Optionally assign a random related Financing ID
        if (availableFinancingIds.length > 0 && Math.random() < 0.7) { // 70% chance to link financing
          projectData.relatedFinancing = availableFinancingIds[Math.floor(Math.random() * availableFinancingIds.length)];
        }

        // Ensure conditional fields match project type (AI might hallucinate)
        const projectType = projectData.projectType;
        if (projectType !== 'event') delete projectData.eventDetails;
        if (projectType !== 'infrastructure') delete projectData.infrastructureDetails;
        if (projectType !== 'program') delete projectData.programDetails;

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
    // Create an array of years starting from the current year and going backwards
    // For example, if count=3 and currentYear=2024, this creates [2024, 2023, 2022]
    // This ensures each demographic record will have a unique year assigned to it
    console.log("Current Year: ", currentYear);
    // Ensure we're using the actual current year (2025) instead of relying on Date()
    const actualCurrentYear = 2025;
    const years = [2024, 2023, 2022];
    console.log("Count: ", count);
    console.log("Years: ", years);
    // Add debug to check if count is being passed correctly
    if (years.length === 0) {
      logger.warn(`Years array is empty. Count: ${count}, Current year: ${actualCurrentYear}`);
      // Fallback to ensure we have at least one year if count is problematic
      return [actualCurrentYear];
    }

    const prompt = `Generate ${count} annual demographic records for a Filipino barangay, one for each year: ${years.join(', ')}.
    
    Requirements:
    - For each record, set the 'year' field to one of the unique years provided: ${years.join(', ')}.
    - Generate realistic population counts (maleCount, femaleCount) appropriate for a barangay (e.g., 500-5000 total), showing slight year-over-year changes.
    - Generate plausible counts for householdsCount, voterCount, pwdCount relative to the total population.
    - Create 5-8 ageGroups per record, covering ranges like '0-4', '5-9', ..., '65+' with corresponding counts that sum approximately to the total population.
    - Create 3-5 chronicDiseases entries per record with common disease names (Hypertension, Diabetes, Asthma, etc.) and plausible counts.
    
    Return the data as structured JSON matching the specified schema. Ensure each record has a unique 'year' from the list. Do not include the 'submittedBy' or 'totalPopulation' fields.`;

    logger.debug("Sending demographics prompt to Gemini:", { prompt: prompt.substring(0, 100) + "..." });

    const result = await structuredModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    const response = result.response;
    logger.debug("Received demographics response from Gemini API");

    const data = response.text();
    let demographicsData;
    try {
      demographicsData = safeJsonParse(data, 'demographicsData');
      logger.debug("Successfully parsed JSON response for demographics");
      if (!demographicsData.records || !Array.isArray(demographicsData.records)) {
        const arrayMatch = data.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (arrayMatch) {
          demographicsData = { records: safeJsonParse(arrayMatch[0], 'demographicsArrayFallback') };
           logger.debug("Used fallback array extraction for demographics", { count: demographicsData.records.length });
        }
        if (!demographicsData.records || !Array.isArray(demographicsData.records)) {
           throw new Error("Demographics response missing records array");
        }
      }
       logger.info(`Parsed ${demographicsData.records.length} demographic records from response`);
    } catch (error) {
      logger.error("Failed to parse JSON response for demographics", error);
      logger.debug("Raw demographics response", { rawData: data });
      throw new Error(`Failed to parse structured output for demographics: ${error.message}`);
    }

    // Ensure years are unique and assigned correctly
    const assignedYears = new Set();
    const finalRecords = [];
    let yearIndex = 0;
    for (const demoRecord of demographicsData.records) {
        // Assign a unique year if available
        if (yearIndex < years.length) {
            demoRecord.year = years[yearIndex++];
            assignedYears.add(demoRecord.year);
            finalRecords.push(demoRecord);
        } else {
             logger.warn("More demographic records generated than requested years. Discarding extra record.", demoRecord);
        }
    }
    // If fewer records were generated than years, log a warning
    if (finalRecords.length < count) {
        logger.warn(`AI generated only ${finalRecords.length} demographic records, expected ${count}.`);
    }


    for (const demoData of finalRecords) {
      try {
        // Assign a random submitter User ID
        const submitterId = availableUserIds[Math.floor(Math.random() * availableUserIds.length)];
        demoData.submittedBy = submitterId;

        // Calculate totalPopulation (Payload doesn't do this automatically)
        demoData.totalPopulation = (demoData.maleCount || 0) + (demoData.femaleCount || 0);

        logger.debug("Creating demographic record", { year: demoData.year });

        const demographic = await payload.create({
          collection: 'demographics',
          data: demoData
        });
        // console.log("Payload Demographics: ", demographic);
        demographicsCreated++;
        logger.debug("Created demographic record", { id: demographic.id, count: demographicsCreated });
      } catch (error) {
        logger.error(`Failed to create demographic record for year ${demoData.year}`, error);
         // Log problematic data
        logger.debug('Problematic demographic data:', demoData);
      }
    }

    logger.info(`Successfully created ${demographicsCreated} demographic records`);
    return demographicsCreated;
  } catch (error) {
    logger.error("Error in generateDemographics:", error);
    throw new Error(`Failed to generate demographic data: ${error.message}`);
  }
}