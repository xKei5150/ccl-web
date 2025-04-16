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
import { createFinancingRecord, updateFinancingRecord } from "@/app/(app)/dashboard/financing/actions";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  APPROVAL_STATES, 
  ACCOUNT_TYPES,
  validateGovernmentRecord 
} from "@/lib/finance-utils";
import FinancingAuditHistory from "./FinancingAuditHistory";

export default function FinancingForm({ data, isEdit = false }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState("groups");
  const [groups, setGroups] = useState([
    {
      title: "Group 1",
      description: "",
      subtotalOperation: "sum",
      items: [
        { number: 1, title: "", value: 0, operation: "add", accountCode: "", fiscalPeriod: "" }
      ]
    }
  ]);
  const [finalCalculations, setFinalCalculations] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({0: true});
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

  // Initialize state from data prop for editing
  useEffect(() => {
    if (isEdit && data) {
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
  }, [data, isEdit]);

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
  
  // Render validation results
  const renderValidationResults = () => {
    if (!validationResult) return null;
    
    return (
      <div className="space-y-4">
        {validationResult.errors.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-destructive">Errors:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {validationResult.errors.map((error, index) => (
                <li key={index} className="text-destructive">{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {validationResult.warnings.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-amber-500">Warnings:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {validationResult.warnings.map((warning, index) => (
                <li key={index} className="text-amber-500">{warning}</li>
              ))}
            </ul>
          </div>
        )}
        
        {validationResult.isValid && validationResult.warnings.length === 0 && (
          <div className="p-4 bg-green-50 text-green-700 rounded">
            No compliance issues found.
          </div>
        )}
      </div>
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation for all forms
    if (!title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: "Validation Error",
        description: "Description is required",
        variant: "destructive",
      });
      return;
    }
    
    // Validate groups
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      if (!group.title.trim()) {
        toast({
          title: "Validation Error",
          description: `Group ${i + 1} must have a title`,
          variant: "destructive",
        });
        return;
      }
      
      // Validate items in this group
      const invalidItems = group.items.filter(item => !item.title.trim());
      if (invalidItems.length > 0) {
        toast({
          title: "Validation Error",
          description: `All items in Group ${i + 1} must have a title`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Validate final calculations
    for (let i = 0; i < finalCalculations.length; i++) {
      const calc = finalCalculations[i];
      if (!calc.title.trim()) {
        toast({
          title: "Validation Error",
          description: `Final calculation step ${i + 1} must have a title`,
          variant: "destructive",
        });
        return;
      }
      
      if (calc.operation === "groupRef" && (calc.groupReference < 0 || calc.groupReference >= groups.length)) {
        toast({
          title: "Validation Error",
          description: `Final calculation step ${i + 1} references an invalid group`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Government compliance validation
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
      // Create FormData and add the JSON string for both create and edit with all fields
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
      
      if (isEdit && data?.id) {
        await updateFinancingRecord(formData, data.id);
        
        toast({
          title: "Success",
          description: "Financing record updated successfully",
        });
        
        router.push(`/dashboard/financing/${data.id}`);
      } else {
        await createFinancingRecord(formData);
        
        toast({
          title: "Success",
          description: "Financing record created successfully",
        });
        
        router.push("/dashboard/financing");
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEdit ? 'update' : 'create'} financing record`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-2">
          <Link href={isEdit ? `/dashboard/financing/${data?.id || ''}` : "/dashboard/financing"}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{isEdit ? "Edit" : "Create"} Financing Record</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the financing record details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Financing record title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide a detailed description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="approvalState">Approval State</Label>
                  <Select value={approvalState} onValueChange={setApprovalState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select approval state" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPROVAL_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select value={accountType} onValueChange={setAccountType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCOUNT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="groups">Groups & Items</TabsTrigger>
              <TabsTrigger value="calculations">Final Calculations</TabsTrigger>
              <TabsTrigger value="compliance">Compliance Info</TabsTrigger>
              {isEdit && data?.id && <TabsTrigger value="audit-history">Audit History</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="groups" className="space-y-4 mt-6">
              {groups.map((group, groupIndex) => (
                <Card key={groupIndex}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleGroupExpansion(groupIndex)}
                          className="mr-2"
                        >
                          {expandedGroups[groupIndex] ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </Button>
                        
                        <div>
                          <CardTitle className="text-xl mb-1">
                            <Input 
                              placeholder="Group Title" 
                              value={group.title}
                              onChange={(e) => updateGroup(groupIndex, "title", e.target.value)}
                              className="border-0 p-0 text-xl font-semibold focus-visible:ring-0"
                              required
                            />
                          </CardTitle>
                          
                          <CardDescription>
                            <Textarea
                              placeholder="Group Description" 
                              value={group.description}
                              onChange={(e) => updateGroup(groupIndex, "description", e.target.value)}
                              className="border-0 p-0 text-sm text-muted-foreground focus-visible:ring-0 min-h-0 h-auto"
                              rows={1}
                            />
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="mr-4">
                          <Label htmlFor={`group-subtotal-${groupIndex}`} className="text-sm">Subtotal Operation</Label>
                          <Select
                            value={group.subtotalOperation}
                            onValueChange={(value) => updateGroup(groupIndex, "subtotalOperation", value)}
                          >
                            <SelectTrigger id={`group-subtotal-${groupIndex}`} className="w-32">
                              <SelectValue placeholder="Sum" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sum">Sum</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="min">Minimum</SelectItem>
                              <SelectItem value="max">Maximum</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeGroup(groupIndex)}
                          disabled={groups.length <= 1}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedGroups[groupIndex] && (
                    <>
                      <CardContent className="pb-3">
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
                            
                            <div className="col-span-2">
                              <Label htmlFor={`item-operation-${groupIndex}-${itemIndex}`}>Operation</Label>
                              <Select
                                value={item.operation}
                                onValueChange={(value) => updateItem(groupIndex, itemIndex, "operation", value)}
                              >
                                <SelectTrigger id={`item-operation-${groupIndex}-${itemIndex}`}>
                                  <SelectValue placeholder="Add" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="add">Add</SelectItem>
                                  <SelectItem value="subtract">Subtract</SelectItem>
                                  <SelectItem value="multiply">Multiply</SelectItem>
                                  <SelectItem value="divide">Divide</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="col-span-2">
                              <Label htmlFor={`item-accountCode-${groupIndex}-${itemIndex}`}>Account Code</Label>
                              <Input
                                id={`item-accountCode-${groupIndex}-${itemIndex}`}
                                placeholder="Account code"
                                value={item.accountCode}
                                onChange={(e) => updateItem(groupIndex, itemIndex, "accountCode", e.target.value)}
                              />
                            </div>
                            
                            <div className="col-span-1 flex items-end justify-end">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => removeItem(groupIndex, itemIndex)}
                                disabled={group.items.length <= 1}
                                type="button"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                      
                      <CardFooter className="flex justify-end">
                        <Button 
                          variant="outline" 
                          onClick={() => addItem(groupIndex)}
                          type="button"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Button>
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={addGroup}
                  type="button"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Group
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="calculations" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Final Calculations</CardTitle>
                  <CardDescription>Define how to calculate the final value</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {finalCalculations.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No calculations defined yet. Add some below.
                    </div>
                  )}
                  
                  {finalCalculations.map((calc, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 border rounded-md p-4">
                      <div className="col-span-1">
                        <Label htmlFor={`calc-number-${index}`}>#</Label>
                        <Input
                          id={`calc-number-${index}`}
                          value={calc.number}
                          disabled
                        />
                      </div>
                      
                      <div className="col-span-4">
                        <Label htmlFor={`calc-title-${index}`}>Title</Label>
                        <Input
                          id={`calc-title-${index}`}
                          placeholder="Step title"
                          value={calc.title}
                          onChange={(e) => updateFinalCalculation(index, "title", e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Label htmlFor={`calc-operation-${index}`}>Operation</Label>
                        <Select
                          value={calc.operation}
                          onValueChange={(value) => updateFinalCalculation(index, "operation", value)}
                        >
                          <SelectTrigger id={`calc-operation-${index}`}>
                            <SelectValue placeholder="Add" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">Add</SelectItem>
                            <SelectItem value="subtract">Subtract</SelectItem>
                            <SelectItem value="multiply">Multiply</SelectItem>
                            <SelectItem value="divide">Divide</SelectItem>
                            <SelectItem value="groupRef">Group Reference</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {calc.operation === "groupRef" ? (
                        <div className="col-span-3">
                          <Label htmlFor={`calc-groupRef-${index}`}>Group</Label>
                          <Select
                            value={calc.groupReference?.toString()}
                            onValueChange={(value) => updateFinalCalculation(index, "groupReference", value)}
                          >
                            <SelectTrigger id={`calc-groupRef-${index}`}>
                              <SelectValue placeholder="Select Group" />
                            </SelectTrigger>
                            <SelectContent>
                              {groups.map((group, groupIndex) => (
                                <SelectItem key={groupIndex} value={groupIndex.toString()}>
                                  {group.title || `Group ${groupIndex + 1}`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ) : (
                        <div className="col-span-3">
                          <Label htmlFor={`calc-value-${index}`}>Value</Label>
                          <Input
                            id={`calc-value-${index}`}
                            type="number"
                            step="any"
                            placeholder="0"
                            value={calc.value}
                            onChange={(e) => updateFinalCalculation(index, "value", e.target.value)}
                            required={calc.operation !== "groupRef"}
                          />
                        </div>
                      )}
                      
                      <div className="col-span-2 flex items-end justify-end">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFinalCalculation(index)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={addFinalCalculation}
                    type="button"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Calculation Step
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="compliance" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Information</CardTitle>
                  <CardDescription>Government-specific information required for compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fiscalYear">Fiscal Year</Label>
                    <Input
                      id="fiscalYear"
                      placeholder="e.g., 2023-2024"
                      value={fiscalYear}
                      onChange={(e) => setFiscalYear(e.target.value)}
                    />
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
            
            {isEdit && data?.id && (
              <TabsContent value="audit-history" className="space-y-4 mt-6">
                <FinancingAuditHistory recordId={data.id} />
              </TabsContent>
            )}
          </Tabs>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link href={isEdit ? `/dashboard/financing/${data?.id || ''}` : "/dashboard/financing"}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? `${isEdit ? 'Updating' : 'Creating'}...` : (isEdit ? 'Update Record' : 'Create Record')}
              {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 