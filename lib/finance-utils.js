// Utility functions for government financing calculations

// Status constants for government spending approval workflow
export const APPROVAL_STATES = [
  { label: 'Draft', value: 'draft' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

// Account code types for government spending
export const ACCOUNT_TYPES = [
  { label: 'Capital Expenditure', value: 'capital' },
  { label: 'Operational Expenditure', value: 'operational' },
  { label: 'Grant', value: 'grant' },
  { label: 'Revenue', value: 'revenue' },
  { label: 'Transfer', value: 'transfer' },
];

// Calculate subtotal for a group
export function calculateGroupSubtotal(group) {
  try {
    if (!group?.items?.length) return 0;
    
    let subtotal = 0;
    const items = group.items;
    
    // Handle first item specially
    if (items[0].operation === 'add' || items[0].operation === 'subtract') {
      subtotal = items[0].operation === 'subtract' ? -parseFloat(items[0].value) || 0 : parseFloat(items[0].value) || 0;
    } else {
      // For multiply/divide as first item, start with the value
      subtotal = parseFloat(items[0].value) || 0;
    }
    
    // Process remaining items
    for (let i = 1; i < items.length; i++) {
      const item = items[i];
      const value = parseFloat(item.value) || 0;
      
      switch (item.operation) {
        case 'add': subtotal += value; break;
        case 'subtract': subtotal -= value; break;
        case 'multiply': subtotal *= value; break;
        case 'divide': 
          if (value !== 0) subtotal /= value;
          else return NaN; // Division by zero
          break;
      }
    }
    
    return subtotal;
  } catch (error) {
    console.error("Error calculating group subtotal:", error);
    return 0;
  }
}

// Apply alternative group operations if specified
export function applyGroupOperation(group, subtotal) {
  try {
    // If standard sum, just return the subtotal
    if (!group.subtotalOperation || group.subtotalOperation === 'sum') {
      return subtotal;
    }
    
    const items = group.items || [];
    const values = items.map(item => parseFloat(item.value) || 0);
    
    switch (group.subtotalOperation) {
      case 'average': 
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      case 'min': 
        return values.length ? Math.min(...values) : 0;
      case 'max': 
        return values.length ? Math.max(...values) : 0;
      default: 
        return subtotal;
    }
  } catch (error) {
    console.error("Error applying group operation:", error);
    return subtotal;
  }
}

// Calculate the final total with detailed steps for user understanding
export function calculateFinancingTotal(data, includeSteps = false) {
  try {
    // Initialize steps array if user wants to see calculation breakdown
    const steps = includeSteps ? [] : null;
    
    if (!data) {
      if (includeSteps) steps.push({ type: 'error', message: 'No data provided for calculation' });
      return { total: 0, steps };
    }
    
    // Calculate all group subtotals first
    const groups = data.groups || [];
    const groupSubtotals = [];
    
    if (includeSteps && groups.length === 0) {
      steps.push({ type: 'info', message: 'No groups found in data, using zero as total' });
    }
    
    // Calculate each group's subtotal
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const rawSubtotal = calculateGroupSubtotal(group);
      const finalSubtotal = applyGroupOperation(group, rawSubtotal);
      groupSubtotals.push(finalSubtotal);
      
      if (includeSteps) {
        steps.push({ 
          type: 'group', 
          groupIndex: i,
          groupName: group.title || `Group ${i+1}`,
          rawSubtotal: parseFloat(rawSubtotal.toFixed(2)),
          operation: group.subtotalOperation || 'sum',
          finalSubtotal: parseFloat(finalSubtotal.toFixed(2))
        });
      }
    }
    
    // If no final calculations, just sum the group subtotals
    const finalCalculations = data.finalCalculations || [];
    
    if (!finalCalculations.length) {
      const total = groupSubtotals.reduce((sum, subtotal) => sum + subtotal, 0);
      
      if (includeSteps) {
        steps.push({ 
          type: 'summary', 
          message: 'No final calculations specified, summing all group subtotals',
          calculation: 'Sum of all groups',
          result: parseFloat(total.toFixed(2))
        });
      }
      
      return { 
        total: parseFloat(total.toFixed(2)), 
        steps 
      };
    }
    
    // Process final calculations
    let total = 0;
    let currentStep = '';
    
    // Handle first calculation - this sets our starting value
    const firstCalc = finalCalculations[0];
    
    if (firstCalc.operation === 'groupRef') {
      const groupIndex = parseInt(firstCalc.groupReference, 10);
      if (groupIndex >= 0 && groupIndex < groupSubtotals.length) {
        total = groupSubtotals[groupIndex];
        currentStep = `Starting with ${data.groups[groupIndex]?.title || `Group ${groupIndex+1}`} (${parseFloat(total.toFixed(2))})`;
      } else {
        if (includeSteps) {
          steps.push({ 
            type: 'error', 
            message: `Invalid group reference ${groupIndex} in first calculation` 
          });
        }
        return { total: 0, steps };
      }
    } else if (['add', 'subtract'].includes(firstCalc.operation)) {
      const value = parseFloat(firstCalc.value || 0);
      total = firstCalc.operation === 'subtract' ? -value : value;
      currentStep = `Starting with ${firstCalc.operation} ${value} = ${parseFloat(total.toFixed(2))}`;
    } else {
      // For multiply/divide, set the base value
      total = parseFloat(firstCalc.value || 0);
      currentStep = `Starting with value ${parseFloat(total.toFixed(2))}`;
    }
    
    if (includeSteps) {
      steps.push({ 
        type: 'calculation', 
        step: 1,
        title: firstCalc.title || 'Initial value',
        operation: firstCalc.operation,
        value: firstCalc.operation === 'groupRef' 
          ? `Group ${firstCalc.groupReference} (${parseFloat(total.toFixed(2))})` 
          : parseFloat(firstCalc.value || 0),
        result: parseFloat(total.toFixed(2)),
        description: currentStep
      });
    }
    
    // Process remaining calculations
    for (let i = 1; i < finalCalculations.length; i++) {
      const calc = finalCalculations[i];
      const prevTotal = total;
      
      if (calc.operation === 'groupRef') {
        const groupIndex = parseInt(calc.groupReference, 10);
        if (groupIndex >= 0 && groupIndex < groupSubtotals.length) {
          const groupValue = groupSubtotals[groupIndex];
          // Apply the operation for group references (default to addition)
          total += groupValue;
          currentStep = `${parseFloat(prevTotal.toFixed(2))} + ${data.groups[groupIndex]?.title || `Group ${groupIndex+1}`} (${parseFloat(groupValue.toFixed(2))}) = ${parseFloat(total.toFixed(2))}`;
        } else {
          if (includeSteps) {
            steps.push({ 
              type: 'error', 
              message: `Invalid group reference ${groupIndex} in calculation ${i+1}` 
            });
          }
          continue;
        }
      } else {
        const value = parseFloat(calc.value || 0);
        const prevValue = total;
        
        switch (calc.operation) {
          case 'add': 
            total += value; 
            currentStep = `${parseFloat(prevValue.toFixed(2))} + ${value} = ${parseFloat(total.toFixed(2))}`;
            break;
          case 'subtract': 
            total -= value; 
            currentStep = `${parseFloat(prevValue.toFixed(2))} - ${value} = ${parseFloat(total.toFixed(2))}`;
            break;
          case 'multiply': 
            total *= value; 
            currentStep = `${parseFloat(prevValue.toFixed(2))} × ${value} = ${parseFloat(total.toFixed(2))}`;
            break;
          case 'divide': 
            if (value !== 0) {
              total /= value;
              currentStep = `${parseFloat(prevValue.toFixed(2))} ÷ ${value} = ${parseFloat(total.toFixed(2))}`;
            } else {
              if (includeSteps) {
                steps.push({ 
                  type: 'error', 
                  message: `Division by zero in calculation ${i+1}` 
                });
              }
              return { total: NaN, steps };
            }
            break;
        }
      }
      
      if (includeSteps) {
        steps.push({ 
          type: 'calculation', 
          step: i + 1,
          title: calc.title || `Step ${i+1}`,
          operation: calc.operation,
          value: calc.operation === 'groupRef' 
            ? `Group ${calc.groupReference} (${parseFloat(groupSubtotals[parseInt(calc.groupReference, 10)].toFixed(2))})` 
            : parseFloat(calc.value || 0),
          result: parseFloat(total.toFixed(2)),
          description: currentStep
        });
      }
    }
    
    if (includeSteps) {
      steps.push({ 
        type: 'final', 
        message: 'Final calculation result',
        result: parseFloat(total.toFixed(2))
      });
    }
    
    return { 
      total: parseFloat(total.toFixed(2)), 
      steps 
    };
  } catch (error) {
    console.error("Error calculating financing total:", error);
    return { 
      total: 0, 
      steps: [{ type: 'error', message: `Calculation error: ${error.message}` }] 
    };
  }
}

// Add budget tracking and variance analysis
export function calculateBudgetVariance(actualAmount, budgetedAmount) {
  if (typeof actualAmount !== 'number' || typeof budgetedAmount !== 'number') {
    return { variance: 0, percentage: 0, status: 'invalid' };
  }
  
  const variance = actualAmount - budgetedAmount;
  const percentage = budgetedAmount !== 0 ? (variance / Math.abs(budgetedAmount)) * 100 : 0;
  
  let status = 'on-budget';
  if (variance > 0) {
    status = 'over-budget';
  } else if (variance < 0) {
    status = 'under-budget';
  }
  
  return {
    variance: parseFloat(variance.toFixed(2)),
    percentage: parseFloat(percentage.toFixed(2)),
    status
  };
}

// Create an audit log entry for financing changes
// Expects the payload client instance to be passed in.
export async function createAuditEntry(payload, params) {
  try {
    const { action, recordId, financingTitle, userId, previousState, newState, changes, notes } = params;
    
    console.log('Creating audit entry:', {
      action,
      recordId,
      financingTitle,
      userId,
      collection: 'financing-audit-log'
    });
    
    if (!payload) {
      console.error('No payload client provided to createAuditEntry');
      return false;
    }
    
    // Use the passed-in payload instance
    const result = await payload.create({
      collection: 'financing-audit-log',
      data: {
        timestamp: new Date().toISOString(),
        user: userId,
        action,
        record: recordId,
        financingTitle,
        previousState,
        newState,
        changes: changes || {},
        notes
      }
    });
    
    console.log('Audit entry created successfully:', result.id);
    return true;
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Log more details about the error
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return false;
  }
}

// Format currency for government reporting
export function formatGovCurrency(amount, currency = 'PHP', locale = 'en-US') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'N/A';
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount.toFixed(2)}`;
  }
} 