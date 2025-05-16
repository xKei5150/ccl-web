"use server";

import {
  genericCreate,
  genericFind,
  genericFindByID,
  genericUpdate,
  genericDelete,
} from "@/lib/services/PayloadDataService";
import { payload } from "@/lib/payload";
import { headers } from "next/headers";
// Import calculation functions from utility file
import { calculateGroupSubtotal, applyGroupOperation, calculateFinancingTotal } from "@/lib/finance-utils";

export async function getFinancingRecords(page = 1, limit = 10) {
  return genericFind("financing", page, limit);
}

export async function getFinancingRecord(id) {
  return genericFindByID("financing", id);
}

export async function createFinancingRecord(formData) {
  try {
    const headersList = await headers();
    const { user } = await payload.auth({ headers: headersList });
    
    const data = JSON.parse(formData.get("json"));
    
    // Ensure createdBy is set to the current user
    if (!data.createdBy && user?.id) {
      data.createdBy = user.id;
    }
    
    return genericCreate("financing", data, "/dashboard/financing");
  } catch (error) {
    console.error("Error creating financing record:", error);
    throw new Error("Failed to create financing record");
  }
}

export async function updateFinancingRecord(formData, id) {
  try {
    const data = JSON.parse(formData.get("json"));
    return genericUpdate("financing", id, data, `/dashboard/financing/${id}`);
  } catch (error) {
    console.error("Error updating financing record:", error);
    throw new Error("Failed to update financing record");
  }
}

export async function deleteFinancingRecord(ids) {
  return genericDelete("financing", ids, `/dashboard/financing`);
}

// Export the calculation functions from the utility file
export { calculateGroupSubtotal, applyGroupOperation, calculateFinancingTotal };

// Add reporting-related actions here
export async function calculateReportData(params) {
  'use server';
  
  const { reportType, fiscalYear, accountType, dateRange } = params;
  
  try {
    // Create filters based on params
    const filters = {};
    if (fiscalYear) filters.fiscalYear = { equals: fiscalYear };
    if (accountType) filters.accountType = { equals: accountType };
    
    // Fetch financing records based on filters
    const response = await payload.find({
      collection: 'financing',
      where: filters,
      depth: 2 // To get nested groups and items
    });
    
    const records = response.docs || [];
    
    // If no records found, return empty data structure
    if (!records.length) {
      return {
        byAccountType: [],
        topSpendingCategories: [],
        budgetComparison: [],
        spendingTrends: [],
        approvalStatus: []
      };
    }
    
    // Process records based on report type
    switch (reportType) {
      case 'spending':
        return generateSpendingReport(records);
      case 'budget':
        return generateBudgetComparisonReport(records);
      case 'trends':
        return generateTrendsReport(records);
      case 'approval':
        return generateApprovalReport(records);
      default:
        return generateSpendingReport(records);
    }
  } catch (error) {
    console.error("Error calculating report data:", error);
    throw new Error("Failed to generate report");
  }
}

// Helper function to generate spending report data
function generateSpendingReport(records) {
  // Aggregate data by account type
  const accountTypeTotals = {};
  
  records.forEach(record => {
    const accountType = record.accountType || 'undefined';
    const displayName = getAccountTypeDisplayName(accountType);
    
    // Sum up budgeted amounts
    accountTypeTotals[displayName] = (accountTypeTotals[displayName] || 0) + (record.budgetedAmount || 0);
  });
  
  // Format data for charts
  const byAccountType = Object.keys(accountTypeTotals).map(name => ({
    name,
    value: accountTypeTotals[name]
  }));
  
  // Generate top spending categories from groups
  const categorySpending = {};
  
  records.forEach(record => {
    (record.groups || []).forEach(group => {
      const categoryName = group.title || 'Unnamed Group';
      // Calculate group total
      let groupTotal = 0;
      (group.items || []).forEach(item => {
        if (item.operation === 'add') {
          groupTotal += (parseFloat(item.value) || 0);
        } else if (item.operation === 'subtract') {
          groupTotal -= (parseFloat(item.value) || 0);
        }
      });
      
      categorySpending[categoryName] = (categorySpending[categoryName] || 0) + groupTotal;
    });
  });
  
  // Sort and take top 5 categories
  const topSpendingCategories = Object.keys(categorySpending)
    .map(name => ({ name, value: categorySpending[name] }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
  
  return {
    byAccountType,
    topSpendingCategories,
    budgetComparison: [],
    spendingTrends: [],
    approvalStatus: []
  };
}

// Helper function to generate budget comparison report
function generateBudgetComparisonReport(records) {
  // Group by fiscal year or department for comparison
  const comparisonData = {};
  
  records.forEach(record => {
    const key = record.fiscalYear || record.departmentCode || 'Unknown';
    
    if (!comparisonData[key]) {
      comparisonData[key] = { budget: 0, actual: 0 };
    }
    
    comparisonData[key].budget += (record.budgetedAmount || 0);
    // Placeholder for actual amount (would come from an integration)
    // For demo, use a random percentage of budget (70-110%)
    const actualPercentage = 0.7 + (Math.random() * 0.4); // 70-110%
    comparisonData[key].actual += (record.budgetedAmount || 0) * actualPercentage;
  });
  
  // Format for chart
  const budgetComparison = Object.keys(comparisonData).map(name => ({
    name,
    budget: comparisonData[name].budget,
    actual: comparisonData[name].actual
  }));
  
  return {
    byAccountType: [],
    topSpendingCategories: [],
    budgetComparison,
    spendingTrends: [],
    approvalStatus: []
  };
}

// Helper function to generate spending trends report
function generateTrendsReport(records) {
  // For demo, generate monthly trends using record creation dates
  const monthlySpendings = {};
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  records.forEach(record => {
    if (record.createdAt) {
      const date = new Date(record.createdAt);
      const monthKey = months[date.getMonth()];
      
      monthlySpendings[monthKey] = (monthlySpendings[monthKey] || 0) + (record.budgetedAmount || 0);
    }
  });
  
  // Ensure all months are represented for a full year view
  const spendingTrends = months.map(month => ({
    month,
    amount: monthlySpendings[month] || 0
  }));
  
  return {
    byAccountType: [],
    topSpendingCategories: [],
    budgetComparison: [],
    spendingTrends,
    approvalStatus: []
  };
}

// Helper function to generate approval status report
function generateApprovalReport(records) {
  // Count records by approval state
  const approvalCounts = {};
  
  records.forEach(record => {
    const state = record.approvalState || 'draft';
    const displayName = getApprovalStateDisplayName(state);
    
    approvalCounts[displayName] = (approvalCounts[displayName] || 0) + 1;
  });
  
  // Format for chart
  const approvalStatus = Object.keys(approvalCounts).map(name => ({
    name,
    count: approvalCounts[name]
  }));
  
  return {
    byAccountType: [],
    topSpendingCategories: [],
    budgetComparison: [],
    spendingTrends: [],
    approvalStatus
  };
}

// Helper to export report data
export async function exportReportData(params) {
  'use server';
  
  const { reportType, data, format } = params;
  
  try {
    // Implementation would depend on how you want to handle downloads
    // This could create a temporary file and return a URL, or
    // stream directly to the client
    
    // For now, just return success - in a real implementation, 
    // this would return a download URL or trigger a download
    return { success: true };
  } catch (error) {
    console.error("Error exporting report data:", error);
    throw new Error("Failed to export report");
  }
}

// Helper functions for display names
function getAccountTypeDisplayName(type) {
  const displayNames = {
    'capital': 'Capital Expenditure',
    'operational': 'Operational Expenditure',
    'grant': 'Grant',
    'revenue': 'Revenue',
    'transfer': 'Transfer',
    'undefined': 'Uncategorized'
  };
  
  return displayNames[type] || 'Other';
}

function getApprovalStateDisplayName(state) {
  const displayNames = {
    'draft': 'Draft',
    'submitted': 'Submitted',
    'under_review': 'Under Review',
    'approved': 'Approved',
    'rejected': 'Rejected'
  };
  
  return displayNames[state] || 'Unknown';
}

// Fetch audit history for a financing record
export async function getFinancingAuditHistory(recordId) {
  'use server';
  
  try {
    // Get payload client
    console.log('getFinancingAuditHistory called for recordId:', recordId);
    
    // Find all audit log entries for this financing record
    const response = await payload.find({
      collection: 'financing-audit-log',
      where: {
        record: {
          equals: recordId
        }
      },
      sort: '-timestamp', // Sort newest first
      depth: 1, // Load one level of relationships
    });
    
    console.log('Found audit entries:', response.docs.length);
    return response.docs || [];
  } catch (error) {
    console.error("Error fetching financing audit history:", error);
    return [];
  }
}

// Get all financing records for the listing page
export async function getFinancingData() {
  'use server';
  
  try {
    const response = await payload.find({
      collection: 'financing',
    });
    
    return response;
  } catch (error) {
    console.error("Error fetching financing data:", error);
    return { docs: [] };
  }
}

// Export financing record to CSV/spreadsheet
export async function exportFinancingToSpreadsheet(id) {
  'use server';
  
  try {
    // Fetch the financing record if an ID is provided, otherwise fetch all records
    let records = [];
    
    if (id) {
      // Export a single record
      const response = await getFinancingRecord(id);
      if (response.data) {
        records = [response.data];
      }
    } else {
      // Export all records
      const response = await payload.find({
        collection: 'financing',
        depth: 2, // Include nested data
        limit: 250 // Reasonable limit
      });
      records = response.docs || [];
    }
    
    if (!records.length) {
      return { error: "No records found to export" };
    }
    
    // Generate CSV content
    let csvContent = "ID,Title,Description,Status,Account Type,Fiscal Year,Budgeted Amount,Department Code,Created By,Created At\n";
    
    // Add data rows
    records.forEach(record => {
      // Format and escape values for CSV
      const formattedRow = [
        record.id,
        escapeCsvValue(record.title),
        escapeCsvValue(record.description || ''),
        record.approvalState || 'draft',
        record.accountType || '',
        record.fiscalYear || '',
        record.budgetedAmount || 0,
        escapeCsvValue(record.departmentCode || ''),
        record.createdBy?.email || 'System',
        record.createdAt ? new Date(record.createdAt).toISOString() : ''
      ].join(',');
      
      csvContent += formattedRow + "\n";
    });
    
    // Include calculation summaries for individual records if only one record
    if (id && records.length === 1) {
      const record = records[0];
      
      // Add groups summary
      if (record.groups?.length) {
        csvContent += "\n\nGROUP SUMMARY\n";
        csvContent += "Group,Title,Items Count,Subtotal\n";
        
        record.groups.forEach((group, index) => {
          const subtotal = calculateGroupSubtotal(group);
          const finalSubtotal = applyGroupOperation(group, subtotal);
          
          csvContent += [
            index + 1,
            escapeCsvValue(group.title),
            group.items?.length || 0,
            finalSubtotal
          ].join(',') + "\n";
        });
      }
      
      // Add calculated total
      const result = calculateFinancingTotal(record);
      csvContent += `\n\nTotal:,${result.total}`;
    }
    
    return {
      success: true,
      filename: id ? `financing-${id}.csv` : 'financing-records.csv',
      data: csvContent,
      contentType: 'text/csv'
    };
  } catch (error) {
    console.error("Error exporting financing to spreadsheet:", error);
    return { error: "Failed to export data" };
  }
}

// Helper function to escape CSV values
function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  
  const stringValue = String(value);
  // If the value contains commas, quotes, or newlines, wrap it in quotes and escape any existing quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
} 