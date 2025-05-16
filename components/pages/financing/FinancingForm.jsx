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
  ACCOUNT_TYPES
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
      console.error("Error submitting financing record:", error);
      
      toast({
        title: "Error",
        description: error.message || "An error occurred while submitting the form",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the form
  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button variant="outline" size="sm" asChild>
          <Link href={isEdit ? `/dashboard/financing/${data?.id}` : "/dashboard/financing"}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      
      {/* Main form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Edit Financing Record" : "New Financing Record"}</CardTitle>
            <CardDescription>
              Enter financing details below. Groups are used for organizing calculations.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Basic information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Financing record title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="approvalState">Approval State</Label>
                <Select value={approvalState} onValueChange={setApprovalState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>
            
            {/* Tabs for different sections */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                <TabsTrigger value="groups">Calculation Groups</TabsTrigger>
                <TabsTrigger value="finalCalculations">Final Calculations</TabsTrigger>
                <TabsTrigger value="details">Additional Details</TabsTrigger>
              </TabsList>
              
              {/* Groups tab content */}
              <TabsContent value="groups" className="space-y-4 pt-4">
                {groups.map((group, groupIndex) => (
                  <Card key={groupIndex}>
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleGroupExpansion(groupIndex)}
                          className="p-0"
                        >
                          {expandedGroups[groupIndex] ? 
                            <ChevronUp className="h-5 w-5 mr-2" /> : 
                            <ChevronDown className="h-5 w-5 mr-2" />
                          }
                          <span className="font-semibold">{group.title || `Group ${groupIndex + 1}`}</span>
                        </Button>
                        
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeGroup(groupIndex)}
                          disabled={groups.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove group</span>
                        </Button>
                      </div>
                    </CardHeader>
                    
                    {expandedGroups[groupIndex] && (
                      <CardContent className="border-t pt-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`group-${groupIndex}-title`}>Group Title</Label>
                              <Input
                                id={`group-${groupIndex}-title`}
                                placeholder="Group title"
                                value={group.title}
                                onChange={(e) => updateGroup(groupIndex, "title", e.target.value)}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`group-${groupIndex}-operation`}>Subtotal Operation</Label>
                              <Select
                                value={group.subtotalOperation}
                                onValueChange={(value) => updateGroup(groupIndex, "subtotalOperation", value)}
                              >
                                <SelectTrigger id={`group-${groupIndex}-operation`}>
                                  <SelectValue placeholder="Select operation" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sum">Sum</SelectItem>
                                  <SelectItem value="average">Average</SelectItem>
                                  <SelectItem value="min">Minimum</SelectItem>
                                  <SelectItem value="max">Maximum</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`group-${groupIndex}-description`}>Group Description</Label>
                            <Textarea
                              id={`group-${groupIndex}-description`}
                              placeholder="Group description"
                              value={group.description}
                              onChange={(e) => updateGroup(groupIndex, "description", e.target.value)}
                              rows={2}
                            />
                          </div>
                          
                          {/* Items in this group */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Items</Label>
                              <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                onClick={() => addItem(groupIndex)}
                              >
                                <Plus className="h-3.5 w-3.5 mr-1" />
                                Add Item
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              {group.items.map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="grid grid-cols-12 gap-2 items-center bg-muted/50 p-2 rounded"
                                >
                                  <div className="col-span-1 text-center font-mono text-sm">
                                    {item.number}
                                  </div>
                                  
                                  <div className="col-span-3">
                                    <Input
                                      placeholder="Item title"
                                      value={item.title}
                                      onChange={(e) => updateItem(groupIndex, itemIndex, "title", e.target.value)}
                                      required
                                    />
                                  </div>
                                  
                                  <div className="col-span-2">
                                    <Select
                                      value={item.operation}
                                      onValueChange={(value) => updateItem(groupIndex, itemIndex, "operation", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Operation" />
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
                                    <Input
                                      type="number"
                                      placeholder="Value"
                                      value={item.value}
                                      onChange={(e) => updateItem(groupIndex, itemIndex, "value", e.target.value)}
                                      step="0.01"
                                    />
                                  </div>
                                  
                                  <div className="col-span-2">
                                    <Input
                                      placeholder="Account code"
                                      value={item.accountCode}
                                      onChange={(e) => updateItem(groupIndex, itemIndex, "accountCode", e.target.value)}
                                    />
                                  </div>
                                  
                                  <div className="col-span-1">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive h-8 w-8 p-0"
                                      onClick={() => removeItem(groupIndex, itemIndex)}
                                      disabled={group.items.length <= 1}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Remove item</span>
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
                
                <Button type="button" variant="outline" onClick={addGroup}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Group
                </Button>
              </TabsContent>
              
              {/* Final calculations tab content */}
              <TabsContent value="finalCalculations" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Final Calculations</CardTitle>
                    <CardDescription>
                      Define calculations that combine groups or add fixed values.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {finalCalculations.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        <p>No final calculations defined. The total will be the sum of all group subtotals.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {finalCalculations.map((calc, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-12 gap-2 items-center bg-muted/50 p-2 rounded"
                          >
                            <div className="col-span-1 text-center font-mono text-sm">
                              {calc.number}
                            </div>
                            
                            <div className="col-span-3">
                              <Input
                                placeholder="Step title"
                                value={calc.title}
                                onChange={(e) => updateFinalCalculation(index, "title", e.target.value)}
                                required
                              />
                            </div>
                            
                            <div className="col-span-2">
                              <Select
                                value={calc.operation}
                                onValueChange={(value) => updateFinalCalculation(index, "operation", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Operation" />
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
                              <div className="col-span-4">
                                <Select
                                  value={calc.groupReference?.toString()}
                                  onValueChange={(value) => updateFinalCalculation(index, "groupReference", value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select group" />
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
                              <div className="col-span-4">
                                <Input
                                  type="number"
                                  placeholder="Value"
                                  value={calc.value}
                                  onChange={(e) => updateFinalCalculation(index, "value", e.target.value)}
                                  step="0.01"
                                />
                              </div>
                            )}
                            
                            <div className="col-span-2 flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-destructive h-8 w-8 p-0"
                                onClick={() => removeFinalCalculation(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove calculation</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Button type="button" variant="outline" onClick={addFinalCalculation}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Calculation Step
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Additional details tab content */}
              <TabsContent value="details" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Details</CardTitle>
                    <CardDescription>
                      Provide additional government-specific information.
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountType">Account Type</Label>
                        <Select value={accountType} onValueChange={setAccountType}>
                          <SelectTrigger id="accountType">
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="fiscalYear">Fiscal Year</Label>
                        <Input
                          id="fiscalYear"
                          placeholder="e.g., 2023"
                          value={fiscalYear}
                          onChange={(e) => setFiscalYear(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budgetedAmount">Budgeted Amount</Label>
                        <Input
                          id="budgetedAmount"
                          type="number"
                          placeholder="0.00"
                          value={budgetedAmount}
                          onChange={(e) => setBudgetedAmount(e.target.value)}
                          step="0.01"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="departmentCode">Department Code</Label>
                        <Input
                          id="departmentCode"
                          placeholder="Department code"
                          value={departmentCode}
                          onChange={(e) => setDepartmentCode(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="budgetReference">Budget Reference</Label>
                      <Input
                        id="budgetReference"
                        placeholder="Reference to budget allocation"
                        value={budgetReference}
                        onChange={(e) => setBudgetReference(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="justification">Justification</Label>
                      <Textarea
                        id="justification"
                        placeholder="Justification for this expenditure"
                        value={justification}
                        onChange={(e) => setJustification(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="authorizationReference">Authorization Reference</Label>
                      <Input
                        id="authorizationReference"
                        placeholder="Legislative or policy authorization"
                        value={authorizationReference}
                        onChange={(e) => setAuthorizationReference(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Audit history for edit mode */}
                {isEdit && data?.id && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Audit History</CardTitle>
                      <CardDescription>
                        View the history of changes made to this financing record.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FinancingAuditHistory recordId={data.id} />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              asChild
            >
              <Link href={isEdit ? `/dashboard/financing/${data?.id}` : "/dashboard/financing"}>
                Cancel
              </Link>
            </Button>
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEdit ? "Update" : "Create"} Record
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
} 