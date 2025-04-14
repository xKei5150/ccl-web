"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Calculator, ArrowLeft, Delete, Edit, Copy, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, FileCheck, FileWarning, Clock, DollarSign, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { deleteFinancingRecord } from "@/app/(app)/dashboard/financing/actions";
import { 
  calculateFinancingTotal, 
  calculateGroupSubtotal, 
  applyGroupOperation,
  calculateBudgetVariance,
  validateGovernmentRecord,
  formatGovCurrency,
  APPROVAL_STATES,
  ACCOUNT_TYPES
} from "@/lib/finance-utils";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

// Various operations with their symbols for display
const operationSymbols = {
  add: "+",
  subtract: "-",
  multiply: "×",
  divide: "÷",
  groupRef: "Ref"
};

// Approval state badge variants
const approvalStateVariants = {
  [APPROVAL_STATES.DRAFT]: { variant: "outline", icon: <Clock className="h-3 w-3 mr-1" /> },
  [APPROVAL_STATES.SUBMITTED]: { variant: "secondary", icon: <FileCheck className="h-3 w-3 mr-1" /> },
  [APPROVAL_STATES.UNDER_REVIEW]: { variant: "secondary", icon: <FileWarning className="h-3 w-3 mr-1" /> },
  [APPROVAL_STATES.APPROVED]: { variant: "success", icon: <CheckCircle2 className="h-3 w-3 mr-1" /> },
  [APPROVAL_STATES.REJECTED]: { variant: "destructive", icon: <AlertTriangle className="h-3 w-3 mr-1" /> }
};

export default function ViewFinancingPage({ data }) {
  const router = useRouter();
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [groupSubtotals, setGroupSubtotals] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [calculationError, setCalculationError] = useState(false);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [showCalculationSteps, setShowCalculationSteps] = useState(false);
  const [budgetVariance, setBudgetVariance] = useState({ variance: 0, percentage: 0, status: 'invalid' });
  const [validationResult, setValidationResult] = useState(null);
  
  // Initialize expanded state for all groups
  useEffect(() => {
    if (data?.groups?.length > 0) {
      const initialExpandedState = {};
      data.groups.forEach((_, index) => {
        initialExpandedState[index] = true; // Start with all groups expanded
      });
      setExpandedGroups(initialExpandedState);
    }
  }, [data?.groups]);
  
  // Calculate subtotals and the final total
  useEffect(() => {
    try {
      if (data?.groups?.length > 0) {
        // Calculate individual group subtotals
        const subtotals = data.groups.map((group) => {
          try {
            const rawSubtotal = calculateGroupSubtotal(group);
            return applyGroupOperation(group, rawSubtotal);
          } catch (error) {
            console.error("Error calculating subtotal for group:", error);
            return 0;
          }
        });
        setGroupSubtotals(subtotals);
        
        // Calculate the final total with steps
        const result = calculateFinancingTotal(data, true);
        setCalculatedTotal(result.total);
        setCalculationSteps(result.steps || []);
        setCalculationError(isNaN(result.total));
        
        // Calculate budget variance if budget amount is specified
        if (data.budgetedAmount && !isNaN(parseFloat(data.budgetedAmount))) {
          const variance = calculateBudgetVariance(result.total, parseFloat(data.budgetedAmount));
          setBudgetVariance(variance);
        }
        
        // Validate the government record
        const recordWithTotal = { ...data, total: result.total };
        const validation = validateGovernmentRecord(recordWithTotal);
        setValidationResult(validation);
      }
    } catch (error) {
      console.error("Error in calculation effect:", error);
      setCalculationError(true);
    }
  }, [data]);

  // Toggle group expansion
  const toggleGroupExpansion = (index) => {
    setExpandedGroups(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  async function handleDelete() {
    try {
      await deleteFinancingRecord([data.id]);
      toast({
        title: "Record deleted",
        description: "The financing record has been successfully deleted.",
      });
      router.push("/dashboard/financing");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the financing record.",
        variant: "destructive",
      });
    }
  }

  // Function to safely format a number or return a fallback
  const safeFormat = (value, fallback = 'N/A') => {
    if (typeof value !== 'number' || isNaN(value)) return fallback;
    return value.toFixed(2);
  };

  // Function to render the calculation steps
  function renderCalculationSteps() {
    if (!calculationSteps.length) {
      return <div className="text-gray-500 text-center py-2">No calculation steps available</div>;
    }

    return (
      <div className="space-y-3">
        {calculationSteps.map((step, index) => {
          if (step.type === 'error') {
            return (
              <div key={index} className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
                <span className="font-semibold">Error: </span>{step.message}
              </div>
            );
          }
          
          if (step.type === 'info') {
            return (
              <div key={index} className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded-md">
                <span className="font-semibold">Info: </span>{step.message}
              </div>
            );
          }
          
          if (step.type === 'group') {
            return (
              <div key={index} className="bg-gray-50 border border-gray-200 p-3 rounded-md">
                <div className="font-medium">{step.groupName}</div>
                <div className="text-sm text-gray-500">
                  Raw subtotal: {step.rawSubtotal} → 
                  {step.operation !== 'sum' && ` Apply ${step.operation} → `}
                  Final: {step.finalSubtotal}
                </div>
              </div>
            );
          }
          
          if (step.type === 'calculation') {
            return (
              <div key={index} className="bg-white border border-gray-200 p-3 rounded-md">
                <div className="font-medium flex justify-between">
                  <span>Step {step.step}: {step.title}</span>
                  <span className="font-mono">{step.result}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {step.description}
                </div>
              </div>
            );
          }
          
          if (step.type === 'summary' || step.type === 'final') {
            return (
              <div key={index} className="bg-green-50 border border-green-200 p-3 rounded-md">
                <div className="font-medium flex justify-between">
                  <span>{step.message}</span>
                  <span className="font-mono font-bold">{step.result}</span>
                </div>
                {step.calculation && (
                  <div className="text-sm text-gray-600 mt-1">{step.calculation}</div>
                )}
              </div>
            );
          }
          
          return null;
        })}
      </div>
    );
  }

  // Render the compliance validation results
  function renderValidationResults() {
    if (!validationResult) {
      return <div className="text-gray-500 text-center py-2">No validation results available</div>;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant={validationResult.isValid ? "success" : "destructive"}>
            {validationResult.isValid ? "Compliant" : "Non-Compliant"}
          </Badge>
          <span className="text-sm text-gray-500">
            Validation timestamp: {new Date(validationResult.timestamp).toLocaleString()}
          </span>
        </div>

        {validationResult.errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-red-600">Compliance Errors</h4>
            <ul className="list-disc pl-5 space-y-1">
              {validationResult.errors.map((error, index) => (
                <li key={index} className="text-red-600">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {validationResult.warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-600">Warnings</h4>
            <ul className="list-disc pl-5 space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <li key={index} className="text-amber-600">{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {validationResult.isValid && validationResult.warnings.length === 0 && (
          <div className="bg-green-50 p-3 rounded-md text-green-700 flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            This record meets all compliance requirements.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/financing">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{data.title}</h1>
          {data.approvalState && (
            <Badge 
              variant={approvalStateVariants[data.approvalState]?.variant || "outline"} 
              className="ml-2 capitalize"
            >
              {approvalStateVariants[data.approvalState]?.icon}
              {data.approvalState.replace(/-/g, ' ')}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/financing/${data.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Delete className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="calculations">Calculations</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Groups Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Item Groups</h2>
                {data.groups && data.groups.length > 0 ? (
                  data.groups.map((group, groupIndex) => (
                    <Card key={groupIndex} className="overflow-hidden">
                      <CardHeader 
                        className="bg-gray-50 cursor-pointer flex flex-row items-center justify-between"
                        onClick={() => toggleGroupExpansion(groupIndex)}
                      >
                        <div>
                          <CardTitle className="flex items-center">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs mr-2">
                              {groupIndex + 1}
                            </span>
                            {group.title}
                          </CardTitle>
                          {group.description && <CardDescription>{group.description}</CardDescription>}
                        </div>
                        <div className="flex items-center">
                          <Badge className="mr-3" variant="outline">
                            Subtotal: {formatGovCurrency(groupSubtotals[groupIndex])}
                          </Badge>
                          <Button variant="ghost" size="icon">
                            {expandedGroups[groupIndex] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>
                      </CardHeader>
                      
                      {expandedGroups[groupIndex] && (
                        <>
                          <CardContent className="pt-4">
                            {group.items && group.items.length > 0 ? (
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead>Operation</TableHead>
                                    {/* New columns for government spending */}
                                    <TableHead>Account Code</TableHead>
                                    <TableHead>Fiscal Period</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {group.items.map((item, index) => (
                                    <TableRow key={index}>
                                      <TableCell>{item.number}</TableCell>
                                      <TableCell>{item.title}</TableCell>
                                      <TableCell>{item.value}</TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="capitalize">
                                          {operationSymbols[item.operation]} {item.operation}
                                        </Badge>
                                      </TableCell>
                                      {/* Account code and fiscal period with placeholders if not available */}
                                      <TableCell>{item.accountCode || '—'}</TableCell>
                                      <TableCell>{item.fiscalPeriod || '—'}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            ) : (
                              <div className="text-center py-4 text-gray-500">
                                No items added to this group
                              </div>
                            )}
                          </CardContent>
                        </>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-6 text-center text-gray-500">
                      No groups added yet
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Final Calculations Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Final Calculations
                  </CardTitle>
                  <CardDescription>
                    Combines group subtotals into the final result
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {data.finalCalculations && data.finalCalculations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Operation</TableHead>
                          <TableHead>Value/Reference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.finalCalculations.map((calc, index) => (
                          <TableRow key={index}>
                            <TableCell>{calc.number}</TableCell>
                            <TableCell>{calc.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {operationSymbols[calc.operation]} {calc.operation}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {calc.operation === 'groupRef' ? (
                                <Badge variant="secondary">
                                  {data.groups[calc.groupReference]?.title || `Group ${parseInt(calc.groupReference, 10) + 1}`}
                                </Badge>
                              ) : (
                                calc.value
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No final calculations defined. Using sum of all group subtotals.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Government Record Details */}
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle>Government Record Details</CardTitle>
                </CardHeader>
                <CardContent className="py-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Record Type</h3>
                    <p className="mt-1 flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {data.accountType || "Not Specified"}
                      </Badge>
                      {data.fiscalYear && (
                        <Badge variant="secondary">FY {data.fiscalYear}</Badge>
                      )}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Budget Reference</h3>
                    <p className="mt-1">{data.budgetReference || "None"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1">{data.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                    <p className="mt-1">{data.createdBy?.email || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p className="mt-1">
                      {data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                    <p className="mt-1">
                      {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Budget Variance Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Budget Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Budgeted Amount</p>
                      <p className="text-lg font-semibold">
                        {formatGovCurrency(parseFloat(data.budgetedAmount || 0))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Actual Amount</p>
                      <p className="text-lg font-semibold">
                        {formatGovCurrency(calculatedTotal)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium">
                        Variance: {formatGovCurrency(budgetVariance.variance)}
                      </p>
                      <Badge 
                        variant={
                          budgetVariance.status === 'over-budget' ? 'destructive' : 
                          budgetVariance.status === 'under-budget' ? 'success' :
                          'outline'
                        }
                      >
                        {budgetVariance.status === 'over-budget' ? `+${budgetVariance.percentage}%` :
                         budgetVariance.status === 'under-budget' ? `${budgetVariance.percentage}%` :
                         'On Budget'}
                      </Badge>
                    </div>
                    <Progress 
                      value={
                        budgetVariance.status === 'invalid' ? 0 :
                        data.budgetedAmount ? (calculatedTotal / parseFloat(data.budgetedAmount)) * 100 : 0
                      } 
                      className={
                        budgetVariance.status === 'over-budget' ? 'bg-red-100' :
                        budgetVariance.status === 'under-budget' ? 'bg-green-100' :
                        'bg-gray-100'
                      }
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Calculated Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center py-4">
                    {calculationError ? (
                      <span className="text-red-500">Error</span>
                    ) : (
                      formatGovCurrency(calculatedTotal)
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Validation Results */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Validation</CardTitle>
                <CardDescription>
                  Results of compliance checks against government regulations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderValidationResults()}
              </CardContent>
            </Card>
            
            {/* Authorization Details */}
            <Card>
              <CardHeader>
                <CardTitle>Authorization Details</CardTitle>
                <CardDescription>
                  Legislative and departmental approval information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Legislative Reference</h3>
                  <p className="mt-1">{data.authorizationReference || "Not specified"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department Code</h3>
                  <p className="mt-1">{data.departmentCode || "Not specified"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Spending Justification</h3>
                  <p className="mt-1 whitespace-pre-line">{data.justification || "Not provided"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Approval History</h3>
                  {data.approvalHistory ? (
                    <ul className="mt-2 space-y-2 text-sm">
                      {data.approvalHistory.map((approval, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-2">
                            {approvalStateVariants[approval.state]?.icon || <Clock className="h-3 w-3" />}
                          </div>
                          <div>
                            <span className="font-medium capitalize">{approval.state.replace(/-/g, ' ')}</span> by {approval.user} on {new Date(approval.timestamp).toLocaleDateString()}
                            {approval.notes && <p className="text-gray-500 mt-1">{approval.notes}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-gray-500">No approval history available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="calculations" className="mt-6">
          <div className="space-y-6">
            {/* Group Subtotals Summary */}
            <Card>
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Group Subtotals</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                {data.groups && data.groups.length > 0 ? (
                  <div className="divide-y">
                    {data.groups.map((group, index) => (
                      <div key={index} className="py-3 px-1 flex justify-between items-center">
                        <span className="font-medium">{group.title}</span>
                        <Badge variant="outline" className="font-mono">
                          {formatGovCurrency(groupSubtotals[index])}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-gray-500">No groups to display</div>
                )}
              </CardContent>
            </Card>
            
            {/* Calculation Steps Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculation Steps
                  </CardTitle>
                  <CardDescription>
                    Step-by-step breakdown of the calculation process
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCalculationSteps(!showCalculationSteps)}
                >
                  {showCalculationSteps ? "Hide Steps" : "Show Steps"}
                </Button>
              </CardHeader>
              {showCalculationSteps && (
                <CardContent>
                  {renderCalculationSteps()}
                </CardContent>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Audit Trail
              </CardTitle>
              <CardDescription>
                Complete history of changes to this record
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.auditTrail && data.auditTrail.length > 0 ? (
                <div className="space-y-4">
                  {data.auditTrail.map((entry, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-4 py-1">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{entry.action}</div>
                        <Badge variant="outline" className="text-xs">
                          {new Date(entry.timestamp).toLocaleString()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        By: {entry.user || 'Unknown'}
                      </div>
                      {entry.changes && (
                        <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                          <div className="font-medium mb-1">Changes:</div>
                          {Object.entries(entry.changes).map(([field, value], i) => (
                            <div key={i} className="grid grid-cols-2 gap-2">
                              <div className="text-gray-600">{field}:</div>
                              <div>
                                {value.from !== undefined && value.to !== undefined ? (
                                  <span>
                                    <span className="line-through text-red-500">{value.from}</span>
                                    {' → '}
                                    <span className="text-green-600">{value.to}</span>
                                  </span>
                                ) : (
                                  JSON.stringify(value)
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No audit trail available for this record</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 