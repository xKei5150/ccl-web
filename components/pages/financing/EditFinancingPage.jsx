"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Calculator, ChevronUp, ChevronDown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateFinancingRecord } from "@/app/(app)/dashboard/financing/actions";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  APPROVAL_STATES, 
  ACCOUNT_TYPES,
  validateGovernmentRecord 
} from "@/lib/finance-utils";
import FinancingAuditHistory from "./FinancingAuditHistory";

export default function EditFinancingPage({ data }) {
  const router = useRouter();
  console.log("EditFinancingPage data:", data, "data.id:", data?.id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("groups");
  const [groups, setGroups] = useState([]);
  const [finalCalculations, setFinalCalculations] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Government-specific fields
  const [approvalState, setApprovalState] = useState("draft");
  const [accountType, setAccountType] = useState("");
  const [fiscalYear, setFiscalYear] = useState("");
  const [budgetedAmount, setBudgetedAmount] = useState(0);
  const [budgetReference, setBudgetReference] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [justification, setJustification] = useState("");
  const [authorizationReference, setAuthorizationReference] = useState("");
  
  // Validation
  const [validationResult, setValidationResult] = useState(null);

  // Initialize state from data prop
  useEffect(() => {
    console.log("financing data", data)
    if (data) {
      setTitle(data.title || "");
      setDescription(data.description || "");
      
      // Initialize groups with at least one group
      const initialGroups = data.groups?.length > 0 
        ? data.groups 
        : [{
            title: "Group 1",
            description: "",
            subtotalOperation: "sum",
            items: [{ number: 1, title: "", value: 0, operation: "add", accountCode: "", fiscalPeriod: "" }]
          }];
      
      // Ensure all items have accountCode and fiscalPeriod if not already present
      initialGroups.forEach(group => {
        (group.items || []).forEach(item => {
          item.accountCode = item.accountCode || "";
          item.fiscalPeriod = item.fiscalPeriod || "";
        });
      });
      
      setGroups(initialGroups);
      
      // Initialize final calculations
      setFinalCalculations(data.finalCalculations || []);
      
      // Initialize government-specific fields
      setApprovalState(data.approvalState || "draft");
      setAccountType(data.accountType || "");
      setFiscalYear(data.fiscalYear || "");
      setBudgetedAmount(data.budgetedAmount || 0);
      setBudgetReference(data.budgetReference || "");
      setDepartmentCode(data.departmentCode || "");
      setJustification(data.justification || "");
      setAuthorizationReference(data.authorizationReference || "");
      
      // Set all groups to be expanded by default
      const initialExpandedState = {};
      initialGroups.forEach((_, index) => {
        initialExpandedState[index] = true;
      });
      setExpandedGroups(initialExpandedState);
    }
  }, [data]);

  // Toggle group expansion
  const toggleGroupExpansion = (index) => {
    setExpandedGroups(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Add a new group
  const addGroup = () => {
    const newGroup = {
      title: `Group ${groups.length + 1}`,
      description: "",
      subtotalOperation: "sum",
      items: [
        { number: 1, title: "", value: 0, operation: "add", accountCode: "", fiscalPeriod: "" }
      ]
    };
    setGroups([...groups, newGroup]);
    
    // Expand the new group
    setExpandedGroups(prev => ({
      ...prev,
      [groups.length]: true
    }));
  };

  // Remove a group
  const removeGroup = (groupIndex) => {
    if (groups.length <= 1) return; // Keep at least one group
    
    const newGroups = [...groups];
    newGroups.splice(groupIndex, 1);
    
    // Update expanded groups state
    const newExpandedGroups = {};
    Object.keys(expandedGroups).forEach(key => {
      const keyNum = parseInt(key, 10);
      if (keyNum < groupIndex) {
        newExpandedGroups[keyNum] = expandedGroups[keyNum];
      } else if (keyNum > groupIndex) {
        newExpandedGroups[keyNum - 1] = expandedGroups[keyNum];
      }
    });
    
    setGroups(newGroups);
    setExpandedGroups(newExpandedGroups);
    
    // Update final calculations that might reference this group
    const updatedFinalCalcs = finalCalculations.map(calc => {
      if (calc.operation === 'groupRef') {
        const refIndex = parseInt(calc.groupReference, 10);
        if (refIndex === groupIndex) {
          // This reference is now invalid, convert to a direct value
          return { ...calc, operation: 'add', value: 0, groupReference: null };
        } else if (refIndex > groupIndex) {
          // Adjust the reference index
          return { ...calc, groupReference: refIndex - 1 };
        }
      }
      return calc;
    });
    setFinalCalculations(updatedFinalCalcs);
  };

  // Update a group's properties
  const updateGroup = (groupIndex, field, value) => {
    const newGroups = [...groups];
    newGroups[groupIndex][field] = value;
    setGroups(newGroups);
  };

  // Add a new item to a group
  const addItem = (groupIndex) => {
    const newGroups = [...groups];
    const group = newGroups[groupIndex];
    
    group.items.push({
      number: group.items.length + 1,
      title: "",
      value: 0,
      operation: "add",
      accountCode: "",
      fiscalPeriod: ""
    });
    
    setGroups(newGroups);
  };

  // Remove an item from a group
  const removeItem = (groupIndex, itemIndex) => {
    const newGroups = [...groups];
    const group = newGroups[groupIndex];
    
    if (group.items.length <= 1) return; // Keep at least one item
    
    group.items.splice(itemIndex, 1);
    
    // Renumber the items
    group.items.forEach((item, i) => {
      item.number = i + 1;
    });
    
    setGroups(newGroups);
  };

  // Update an item's property
  const updateItem = (groupIndex, itemIndex, field, value) => {
    const newGroups = [...groups];
    const item = newGroups[groupIndex].items[itemIndex];
    
    item[field] = field === "value" ? parseFloat(value) || 0 : value;
    setGroups(newGroups);
  };

  // Add a new final calculation
  const addFinalCalculation = () => {
    setFinalCalculations([
      ...finalCalculations,
      {
        number: finalCalculations.length + 1,
        title: "",
        operation: "add",
        value: 0,
        groupReference: null
      }
    ]);
  };

  // Remove a final calculation
  const removeFinalCalculation = (index) => {
    const newCalculations = [...finalCalculations];
    newCalculations.splice(index, 1);
    
    // Renumber the calculations
    newCalculations.forEach((calc, i) => {
      calc.number = i + 1;
    });
    
    setFinalCalculations(newCalculations);
  };

  // Update a final calculation
  const updateFinalCalculation = (index, field, value) => {
    const newCalculations = [...finalCalculations];
    const calc = newCalculations[index];
    
    if (field === "operation" && value === "groupRef") {
      // If switching to group reference, set default reference to first group
      calc.groupReference = 0;
      calc.value = null;
    } else if (field === "operation" && calc.operation === "groupRef") {
      // If switching from group reference, reset the reference
      calc.groupReference = null;
      calc.value = 0;
    }
    
    calc[field] = field === "value" || field === "groupReference" ? 
      parseFloat(value) || 0 : value;
    
    setFinalCalculations(newCalculations);
  };

  // Validate the record before submission
  const validateRecord = () => {
    const recordData = {
      title,
      description,
      approvalState,
      accountType,
      fiscalYear,
      budgetedAmount: parseFloat(budgetedAmount) || 0,
      budgetReference,
      departmentCode,
      justification,
      authorizationReference,
      total: 10000, // A dummy value for validation, real total will be calculated later
    };
    
    return validateGovernmentRecord(recordData);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    // Perform validation
    const validation = validateRecord();
    setValidationResult(validation);
    
    // Continue with warnings, but not with errors
    if (!validation.isValid) {
      toast({
        title: "Compliance Errors",
        description: "Please fix the compliance errors before submitting",
        variant: "destructive",
      });
      
      // Switch to the compliance tab
      setActiveTab("compliance");
      return;
    }
    
    // Show warnings but allow submission
    if (validation.warnings.length > 0) {
      toast({
        title: "Compliance Warnings",
        description: "Record has compliance warnings, but can still be submitted",
        variant: "warning",
      });
    }
    
    setIsSubmitting(true);
    
    try {
      // Create FormData and add the JSON string
      const formData = new FormData();
      formData.append("json", JSON.stringify({
        title,
        description,
        groups,
        finalCalculations,
        approvalState,
        accountType,
        fiscalYear,
        budgetedAmount: parseFloat(budgetedAmount) || 0,
        budgetReference,
        departmentCode,
        justification,
        authorizationReference
      }));
      
      await updateFinancingRecord(formData, data.id);
      
      toast({
        title: "Success",
        description: "Financing record updated successfully",
      });
      
      router.push(`/dashboard/financing/${data.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update financing record",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderValidationResults = () => {
    if (!validationResult) return null;

    return (
      <div className="space-y-4">
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
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href={`/dashboard/financing/${data?.id || ''}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit Financing Record</h1>
        {approvalState && (
          <Badge variant="outline" className="ml-4 capitalize">
            {approvalState.replace(/-/g, ' ')}
          </Badge>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="basic-details">Basic Details</TabsTrigger>
              <TabsTrigger value="groups-items">Groups & Items</TabsTrigger>
              <TabsTrigger value="compliance">Compliance & Approvals</TabsTrigger>
              <TabsTrigger value="audit-history">Audit History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-details" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Edit the basic details for this financing record
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Final Calculations</CardTitle>
                  <CardDescription>
                    Define how the groups should be combined
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold">Calculation Steps</h2>
                      <Button type="button" onClick={addFinalCalculation} variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Add Calculation Step
                      </Button>
                    </div>
                    
                    {finalCalculations.length === 0 && (
                      <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                        <p>No final calculations defined yet.</p>
                        <p className="text-sm mt-2">
                          If no final calculations are added, the system will sum all group subtotals.
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={addFinalCalculation}
                          className="mt-4"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Calculation Step
                        </Button>
                      </div>
                    )}
                    
                    {finalCalculations.map((calc, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs mr-2">
                                {calc.number}
                              </span>
                              <CardTitle className="text-lg">
                                <Input
                                  value={calc.title}
                                  onChange={(e) => updateFinalCalculation(index, "title", e.target.value)}
                                  placeholder="Calculation Title"
                                  className="max-w-xs"
                                  required
                                />
                              </CardTitle>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => removeFinalCalculation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-12 gap-4 items-end">
                            <div className="col-span-4">
                              <Label htmlFor={`calc-operation-${index}`}>Operation</Label>
                              <Select
                                value={calc.operation}
                                onValueChange={(value) => updateFinalCalculation(index, "operation", value)}
                              >
                                <SelectTrigger id={`calc-operation-${index}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="add">Addition (+)</SelectItem>
                                  <SelectItem value="subtract">Subtraction (-)</SelectItem>
                                  <SelectItem value="multiply">Multiplication (×)</SelectItem>
                                  <SelectItem value="divide">Division (÷)</SelectItem>
                                  <SelectItem value="groupRef">Group Reference</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {calc.operation === 'groupRef' ? (
                              <div className="col-span-8">
                                <Label htmlFor={`calc-group-ref-${index}`}>Select Group</Label>
                                <Select
                                  value={calc.groupReference !== null ? calc.groupReference.toString() : "0"}
                                  onValueChange={(value) => updateFinalCalculation(index, "groupReference", value)}
                                >
                                  <SelectTrigger id={`calc-group-ref-${index}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {groups.map((group, groupIndex) => (
                                      <SelectItem key={groupIndex} value={groupIndex.toString()}>
                                        {group.title} (Group {groupIndex + 1})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ) : (
                              <div className="col-span-8">
                                <Label htmlFor={`calc-value-${index}`}>Value</Label>
                                <Input
                                  id={`calc-value-${index}`}
                                  type="number"
                                  step="any"
                                  placeholder="0"
                                  value={calc.value}
                                  onChange={(e) => updateFinalCalculation(index, "value", e.target.value)}
                                  required
                                />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="groups-items" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Item Groups</h2>
                <Button type="button" onClick={addGroup} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Group
                </Button>
              </div>
              
              {groups.map((group, groupIndex) => (
                <Card key={groupIndex} className="overflow-hidden">
                  <CardHeader className="bg-gray-50 flex flex-row items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs mr-2">
                          {groupIndex + 1}
                        </span>
                        <Input
                          value={group.title}
                          onChange={(e) => updateGroup(groupIndex, "title", e.target.value)}
                          placeholder="Group Title"
                          className="max-w-xs"
                          required
                        />
                      </div>
                      <div className="pl-8">
                        <Input
                          value={group.description}
                          onChange={(e) => updateGroup(groupIndex, "description", e.target.value)}
                          placeholder="Group Description (optional)"
                          className="text-sm text-muted-foreground"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <div className="flex flex-col">
                        <Label htmlFor={`group-operation-${groupIndex}`} className="mb-2 text-xs">
                          Subtotal Operation
                        </Label>
                        <Select
                          value={group.subtotalOperation}
                          onValueChange={(value) => updateGroup(groupIndex, "subtotalOperation", value)}
                        >
                          <SelectTrigger id={`group-operation-${groupIndex}`} className="w-[150px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sum">Sum</SelectItem>
                            <SelectItem value="average">Average</SelectItem>
                            <SelectItem value="min">Minimum</SelectItem>
                            <SelectItem value="max">Maximum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex flex-col space-y-2 mt-7">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleGroupExpansion(groupIndex)}
                        >
                          {expandedGroups[groupIndex] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeGroup(groupIndex)}
                          disabled={groups.length <= 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedGroups[groupIndex] && (
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold">Items</h3>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addItem(groupIndex)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                        
                        {group.items.map((item, itemIndex) => (
                          <div className="grid grid-cols-12 gap-4 mt-2 border rounded-md p-4" key={itemIndex}>
                            <div className="col-span-1">
                              <Label htmlFor={`item-number-${groupIndex}-${itemIndex}`}>#</Label>
                              <Input 
                                id={`item-number-${groupIndex}-${itemIndex}`}
                                value={item.number}
                                disabled
                              />
                            </div>
                            
                            <div className="col-span-4">
                              <Label htmlFor={`item-title-${groupIndex}-${itemIndex}`}>Title</Label>
                              <Input
                                id={`item-title-${groupIndex}-${itemIndex}`}
                                placeholder="Item title"
                                value={item.title}
                                onChange={(e) => updateItem(groupIndex, itemIndex, "title", e.target.value)}
                                required
                              />
                            </div>
                            
                            <div className="col-span-2">
                              <Label htmlFor={`item-value-${groupIndex}-${itemIndex}`}>Value</Label>
                              <Input
                                id={`item-value-${groupIndex}-${itemIndex}`}
                                type="number"
                                step="any"
                                placeholder="0"
                                value={item.value}
                                onChange={(e) => updateItem(groupIndex, itemIndex, "value", e.target.value)}
                                required
                              />
                            </div>
                            
                            <div className="col-span-3">
                              <Label htmlFor={`item-operation-${groupIndex}-${itemIndex}`}>Operation</Label>
                              <Select
                                value={item.operation}
                                onValueChange={(value) => updateItem(groupIndex, itemIndex, "operation", value)}
                              >
                                <SelectTrigger id={`item-operation-${groupIndex}-${itemIndex}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="add">Addition (+)</SelectItem>
                                  <SelectItem value="subtract">Subtraction (-)</SelectItem>
                                  <SelectItem value="multiply">Multiplication (×)</SelectItem>
                                  <SelectItem value="divide">Division (÷)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="col-span-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removeItem(groupIndex, itemIndex)}
                                disabled={group.items.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="col-span-2">
                              <Label htmlFor={`item-account-code-${groupIndex}-${itemIndex}`}>Account Code</Label>
                              <Input
                                id={`item-account-code-${groupIndex}-${itemIndex}`}
                                placeholder="Account code"
                                value={item.accountCode || ""}
                                onChange={(e) => updateItem(groupIndex, itemIndex, "accountCode", e.target.value)}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label htmlFor={`item-fiscal-period-${groupIndex}-${itemIndex}`}>Fiscal Period</Label>
                              <Input
                                id={`item-fiscal-period-${groupIndex}-${itemIndex}`}
                                placeholder="e.g. Q1 2023"
                                value={item.fiscalPeriod || ""}
                                onChange={(e) => updateItem(groupIndex, itemIndex, "fiscalPeriod", e.target.value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Approval Status</CardTitle>
                  <CardDescription>
                    Update the approval status of this record
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="approvalState">Current Status</Label>
                    <Select
                      value={approvalState}
                      onValueChange={setApprovalState}
                    >
                      <SelectTrigger id="approvalState">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(APPROVAL_STATES).map(([key, value]) => (
                          <SelectItem key={value} value={value}>
                            {key.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Government Record Details</CardTitle>
                  <CardDescription>
                    Information required for government compliance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select
                        value={accountType}
                        onValueChange={setAccountType}
                      >
                        <SelectTrigger id="accountType">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(ACCOUNT_TYPES).map(([key, value]) => (
                            <SelectItem key={value} value={value}>
                              {key.replace(/_/g, ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="fiscalYear">Fiscal Year</Label>
                      <Input
                        id="fiscalYear"
                        placeholder="e.g., 2023"
                        value={fiscalYear}
                        onChange={(e) => setFiscalYear(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budgetedAmount">Budgeted Amount</Label>
                      <Input
                        id="budgetedAmount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={budgetedAmount}
                        onChange={(e) => setBudgetedAmount(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="budgetReference">Budget Reference</Label>
                      <Input
                        id="budgetReference"
                        placeholder="Budget reference code"
                        value={budgetReference}
                        onChange={(e) => setBudgetReference(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="departmentCode">Department Code</Label>
                    <Input
                      id="departmentCode"
                      placeholder="Department code"
                      value={departmentCode}
                      onChange={(e) => setDepartmentCode(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="authorizationReference">Authorization Reference</Label>
                    <Input
                      id="authorizationReference"
                      placeholder="Legislative authorization"
                      value={authorizationReference}
                      onChange={(e) => setAuthorizationReference(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="justification">Spending Justification</Label>
                    <Textarea
                      id="justification"
                      placeholder="Justify this expenditure"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {validationResult && (
                <Card>
                  <CardHeader>
                    <CardTitle>Validation Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderValidationResults()}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="audit-history" className="space-y-4 mt-6">
              <FinancingAuditHistory recordId={data?.id} />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/financing/${data?.id || ''}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 