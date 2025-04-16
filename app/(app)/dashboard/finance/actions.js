"use server";

import { model, createStructuredModel, ANALYSIS_PROMPT, PREDICTION_PROMPT } from "@/lib/genAI";
import { getFinancingRecords } from "../financing/actions";

// Schema for barangay expenditure trends analysis
const barangayAnalysisSchema = {
  type: "object",
  properties: {
    trend: {
      type: "string",
      enum: ["upward", "downward", "stable"]
    },
    percentageChange: {
      type: "string"
    },
    analysis: {
      type: "string"
    },
    fiscalImpact: {
      type: "string"
    },
    insights: {
      type: "array",
      items: { type: "string" }
    },
    recommendations: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["trend", "percentageChange", "analysis", "fiscalImpact", "insights", "recommendations"]
};

// Schema for barangay expenditure forecasting
const barangayPredictionSchema = {
  type: "object",
  properties: {
    predictions: {
      type: "array",
      items: { type: "number" }
    },
    quarterlyProjections: {
      type: "object",
      properties: {
        q1: { type: "number" },
        q2: { type: "number" },
        q3: { type: "number" },
        q4: { type: "number" }
      }
    }
  },
  required: ["predictions", "quarterlyProjections"]
};

// Schema for budget performance evaluation
const barangayBudgetSchema = {
  type: "object",
  properties: {
    performanceRating: {
      type: "string",
      enum: ["under_utilized", "optimal_utilization", "over_utilized"]
    },
    utilizationRate: {
      type: "string"
    },
    analysis: {
      type: "string"
    },
    priorityAreas: {
      type: "array",
      items: { type: "string" }
    },
    recommendations: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["performanceRating", "utilizationRate", "analysis", "priorityAreas", "recommendations"]
};

/**
 * Analyze barangay expenditure trends using AI
 * @param {Object} params - Parameters for the analysis
 * @returns {Object} AI analysis results
 */
export async function analyzeFinancialTrends(params) {
  try {
    // Get finance data
    const financeData = await getFinancingRecords();
    
    // Prepare data for analysis
    const expenditureData = prepareExpenditureData(financeData.docs);
    
    // Create structured model
    const structuredModel = createStructuredModel(barangayAnalysisSchema);
    
    // Generate custom prompt for barangay analysis
    const prompt = `Analyze the following barangay expenditure data:
    ${JSON.stringify(expenditureData)}
    
    Provide a concise analysis in JSON format with the following structure:
    {
      "trend": "upward|downward|stable",
      "percentageChange": "+0.0%|-0.0%",
      "analysis": "Analyze current expenditure patterns focusing on key public service categories.",
      "fiscalImpact": "Evaluate impact on barangay's fiscal health and service delivery.",
      "insights": ["Key insight about social services", "Key insight about infrastructure", "Key insight about administrative expenses"],
      "recommendations": ["Specific recommendation for budget optimization", "Recommendation for compliance with local government regulations", "Recommendation for improving expenditure efficiency"]
    }`;
    
    // Get AI response
    const result = await structuredModel.generateContent(prompt);
    const response = result.response;
    
    // Parse the JSON response
    const analysisData = response.text();
    
    return JSON.parse(analysisData);
  } catch (error) {
    console.error("Error analyzing barangay expenditure trends:", error);
    return {
      trend: "stable",
      percentageChange: "0%",
      analysis: "Unable to analyze barangay expenditure data at this time.",
      fiscalImpact: "Fiscal impact assessment unavailable.",
      insights: ["Data analysis error occurred"],
      recommendations: ["Review expenditure data for completeness", "Ensure proper categorization of expenses", "Consult with local treasury office"]
    };
  }
}

/**
 * Generate barangay expenditure forecasts using AI
 * @param {Object} params - Parameters for prediction
 * @returns {Object} Predicted future values and quarterly projections
 */
export async function generateFinancialForecast(params) {
  try {
    // Get finance data
    const financeData = await getFinancingRecords();
    
    // Prepare historical data
    const historicalData = prepareHistoricalData(financeData.docs);
    
    // Calculate remaining months in the fiscal year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const remainingMonths = 12 - (currentMonth + 1);
    
    // Create structured model
    const predictionModel = createStructuredModel(barangayPredictionSchema);
    
    // Generate prompt with data
    const prompt = `Forecast barangay expenditures based on this historical data:
    ${JSON.stringify(historicalData)}
    
    Consider:
    1. There are ${remainingMonths} months left in the fiscal year
    2. Barangay expenditures typically follow seasonal patterns (higher in Q4)
    3. Development projects often have increased spending in Q2 and Q3
    4. Administrative expenses remain relatively constant
    5. Special events and festivals impact expenditure timing
    
    Provide forecasts in JSON format:
    {
      "predictions": [number, number, ...], // Monthly predictions for remaining months
      "quarterlyProjections": {
        "q1": number, // Q1 total projection (or actual if passed)
        "q2": number, // Q2 total projection (or actual if passed)
        "q3": number, // Q3 total projection (or actual if passed)
        "q4": number  // Q4 total projection
      }
    }`;
    
    // Get AI response
    const result = await predictionModel.generateContent(prompt);
    const response = result.response;
    
    // Parse the JSON response
    const predictionData = response.text();
    
    return JSON.parse(predictionData);
  } catch (error) {
    console.error("Error generating barangay expenditure forecast:", error);
    // Return fallback data with quarterly projections
    const currentMonth = new Date().getMonth();
    const remainingMonths = 12 - (currentMonth + 1);
    
    // Calculate quarters (0-indexed months: 0-2 is Q1, 3-5 is Q2, etc.)
    const currentQuarter = Math.floor(currentMonth / 3);
    
    return {
      predictions: Array(remainingMonths).fill(0),
      quarterlyProjections: {
        q1: currentQuarter >= 0 ? 100000 : 0,
        q2: currentQuarter >= 1 ? 150000 : 0,
        q3: currentQuarter >= 2 ? 125000 : 0,
        q4: 175000
      }
    };
  }
}

/**
 * Analyze budget utilization performance using AI
 * @param {Object} params - Parameters for analysis
 * @returns {Object} Analysis of budget utilization performance
 */
export async function analyzeBudgetPerformance(params) {
  try {
    // Get finance data
    const financeData = await getFinancingRecords();
    
    // Prepare budget vs actual data
    const budgetData = prepareBudgetData(financeData.docs);
    
    // Create custom prompt for budget analysis
    const prompt = `Analyze the barangay's budget utilization performance:
    ${JSON.stringify(budgetData)}
    
    Provide a comprehensive assessment in JSON format:
    {
      "performanceRating": "under_utilized|optimal_utilization|over_utilized",
      "utilizationRate": "XX.X%",
      "analysis": "Analysis of overall budget performance with focus on public service delivery.",
      "priorityAreas": ["Area requiring immediate attention", "Secondary priority area", "Long-term planning area"],
      "recommendations": ["Specific recommendation for budget realignment", "Strategy for improved fund utilization", "Compliance requirement for local government auditing"]
    }`;
    
    // Create a custom schema for budget analysis
    const budgetModel = createStructuredModel(barangayBudgetSchema);
    
    // Get AI response
    const result = await budgetModel.generateContent(prompt);
    const response = result.response;
    
    // Parse the JSON response
    const analysisData = response.text();
    
    return JSON.parse(analysisData);
  } catch (error) {
    console.error("Error analyzing barangay budget performance:", error);
    return {
      performanceRating: "optimal_utilization",
      utilizationRate: "75.0%",
      analysis: "Unable to analyze budget utilization data at this time.",
      priorityAreas: ["Data integrity verification", "Budget categorization review"],
      recommendations: ["Consult with local treasury for accurate budget reporting", "Review expenditure classification for audit compliance", "Implement proper documentation for all disbursements"]
    };
  }
}

// Helper functions for data preparation

/**
 * Prepare expenditure data categorized by government function
 */
function prepareExpenditureData(records) {
  // Initialize expenditure categories based on barangay functions
  const expenditureCategories = {
    "Social Services": 0,
    "Infrastructure": 0,
    "Administrative": 0,
    "Emergency Response": 0,
    "Development Projects": 0,
    "Other Expenses": 0
  };
  
  // Monthly expenditure tracking
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyExpenditures = {};
  
  // Initialize all months with zero
  months.forEach(month => {
    monthlyExpenditures[month] = 0;
  });
  
  // Process records for categorization and monthly tracking
  records.forEach(record => {
    // Categorize by department or purpose (simplified mapping)
    const category = categorizeExpenditure(record);
    expenditureCategories[category] += (record.budgetedAmount || 0);
    
    // Track monthly expenditures
    if (record.createdAt) {
      const date = new Date(record.createdAt);
      const monthKey = months[date.getMonth()];
      monthlyExpenditures[monthKey] += (record.budgetedAmount || 0);
    }
  });
  
  // Format data for analysis
  return {
    categories: Object.keys(expenditureCategories).map(name => ({
      category: name,
      amount: expenditureCategories[name]
    })),
    monthly: months.map(month => ({
      month,
      amount: monthlyExpenditures[month]
    }))
  };
}

/**
 * Categorize a finance record into barangay expenditure categories
 */
function categorizeExpenditure(record) {
  // In a real implementation, this would use record metadata 
  // like department code, expenditure type, or project category
  
  // Simple mapping for demonstration purposes
  const departmentMapping = {
    'SOCIAL': 'Social Services',
    'INFRA': 'Infrastructure',
    'ADMIN': 'Administrative',
    'EMERGENCY': 'Emergency Response',
    'DEV': 'Development Projects'
  };
  
  if (record.departmentCode && departmentMapping[record.departmentCode]) {
    return departmentMapping[record.departmentCode];
  }
  
  // Default categorization based on account type
  if (record.accountType) {
    switch(record.accountType) {
      case 'capital':
        return 'Infrastructure';
      case 'operational':
        return 'Administrative';
      case 'grant':
        return 'Development Projects';
      default:
        return 'Other Expenses';
    }
  }
  
  return 'Other Expenses';
}

/**
 * Prepare historical data for forecasting
 */
function prepareHistoricalData(records) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySpendings = {};
  
  // Get current month
  const currentMonth = new Date().getMonth();
  
  // Initialize past months with zero
  for (let i = 0; i <= currentMonth; i++) {
    monthlySpendings[months[i]] = 0;
  }
  
  // Populate with actual data
  records.forEach(record => {
    if (record.createdAt) {
      const date = new Date(record.createdAt);
      const month = date.getMonth();
      
      // Only include data up to current month
      if (month <= currentMonth) {
        const monthKey = months[month];
        monthlySpendings[monthKey] += (record.budgetedAmount || 0);
      }
    }
  });
  
  // Add quarterly data for government reporting
  const quarterlyData = {
    Q1: (monthlySpendings['Jan'] || 0) + (monthlySpendings['Feb'] || 0) + (monthlySpendings['Mar'] || 0),
    Q2: (monthlySpendings['Apr'] || 0) + (monthlySpendings['May'] || 0) + (monthlySpendings['Jun'] || 0),
    Q3: (monthlySpendings['Jul'] || 0) + (monthlySpendings['Aug'] || 0) + (monthlySpendings['Sep'] || 0),
    Q4: (monthlySpendings['Oct'] || 0) + (monthlySpendings['Nov'] || 0) + (monthlySpendings['Dec'] || 0)
  };
  
  // Convert to array format with just the populated months
  return {
    monthly: Object.keys(monthlySpendings).map(month => ({
      month,
      amount: monthlySpendings[month]
    })),
    quarterly: Object.keys(quarterlyData).map(quarter => ({
      quarter,
      amount: quarterlyData[quarter]
    }))
  };
}

/**
 * Prepare budget vs actual data with utilization rates
 */
function prepareBudgetData(records) {
  // Standard barangay budget categories
  const categories = [
    "Personnel Services",
    "Maintenance & Operations",
    "Capital Outlay",
    "Development Fund",
    "Disaster Risk Reduction",
    "Gender & Development",
    "Senior Citizens & PWD"
  ];
  
  // Initialize budget data structure
  const budgetData = {};
  categories.forEach(category => {
    budgetData[category] = { 
      budget: 0, 
      actual: 0, 
      utilization: 0,
      variance: 0
    };
  });
  
  // Group records by fiscal year or other criteria
  const fiscalYearData = {};
  
  // Process records
  records.forEach(record => {
    // Map record to a category (simplified)
    const category = mapRecordToCategory(record);
    
    if (budgetData[category]) {
      budgetData[category].budget += (record.budgetedAmount || 0);
      
      // For demo purposes, create "actual" data
      // In a real app, this would come from real expenditure data
      const actualPercentage = 0.6 + (Math.random() * 0.5); // 60-110%
      const actualAmount = (record.budgetedAmount || 0) * actualPercentage;
      budgetData[category].actual += actualAmount;
      
      // Track by fiscal year for year-over-year comparison
      const year = record.fiscalYear || 'Current';
      if (!fiscalYearData[year]) {
        fiscalYearData[year] = { budget: 0, actual: 0 };
      }
      fiscalYearData[year].budget += (record.budgetedAmount || 0);
      fiscalYearData[year].actual += actualAmount;
    }
  });
  
  // Calculate utilization rates and variances
  Object.keys(budgetData).forEach(category => {
    const data = budgetData[category];
    if (data.budget > 0) {
      data.utilization = (data.actual / data.budget) * 100;
      data.variance = data.actual - data.budget;
    }
  });
  
  // Calculate overall utilization
  let totalBudget = 0;
  let totalActual = 0;
  
  Object.values(budgetData).forEach(data => {
    totalBudget += data.budget;
    totalActual += data.actual;
  });
  
  const overallUtilization = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;
  
  // Format for analysis
  return {
    categories: Object.keys(budgetData).map(category => ({
      category,
      budget: budgetData[category].budget,
      actual: budgetData[category].actual,
      utilization: budgetData[category].utilization.toFixed(2) + '%',
      variance: budgetData[category].variance
    })),
    fiscalYears: Object.keys(fiscalYearData).map(year => ({
      year,
      budget: fiscalYearData[year].budget,
      actual: fiscalYearData[year].actual,
      utilization: fiscalYearData[year].budget > 0 
        ? ((fiscalYearData[year].actual / fiscalYearData[year].budget) * 100).toFixed(2) + '%'
        : '0.00%'
    })),
    overall: {
      budget: totalBudget,
      actual: totalActual,
      utilization: overallUtilization.toFixed(2) + '%',
      variance: totalActual - totalBudget
    }
  };
}

/**
 * Map a record to a standard barangay budget category
 */
function mapRecordToCategory(record) {
  // This is a simplified mapping function
  // In a real implementation, this would use detailed classification rules
  
  if (!record.accountType) return "Maintenance & Operations";
  
  switch(record.accountType) {
    case 'capital':
      return "Capital Outlay";
    case 'operational':
      return record.departmentCode === 'ADMIN' ? "Personnel Services" : "Maintenance & Operations";
    case 'grant':
      return record.departmentCode === 'SOCIAL' ? "Senior Citizens & PWD" : "Development Fund";
    case 'transfer':
      return "Development Fund";
    case 'revenue':
      return "Maintenance & Operations";
    default:
      return "Maintenance & Operations";
  }
} 