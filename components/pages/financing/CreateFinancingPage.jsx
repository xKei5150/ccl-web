"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Calculator, MoveUp, MoveDown, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFinancingRecord } from "@/app/(app)/dashboard/financing/actions";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function CreateFinancingPage() {
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
      // Create FormData and add the JSON string
      const formData = new FormData();
      formData.append("json", JSON.stringify({
        title,
        description,
        groups,
        finalCalculations
      }));
      
      await createFinancingRecord(formData);
      
      toast({
        title: "Success",
        description: "Financing record created successfully",
      });
      
      router.push("/dashboard/financing");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to create financing record",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" asChild className="mr-4">
          <Link href="/dashboard/financing">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Financing Record</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Enter the basic details for this financing record
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
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="groups">Groups & Items</TabsTrigger>
              <TabsTrigger value="calculations">Final Calculations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="groups" className="space-y-4 mt-6">
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
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="calculations" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Final Calculations</h2>
                <Button type="button" onClick={addFinalCalculation} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add Calculation Step
                </Button>
              </div>
              
              {finalCalculations.length === 0 && (
                <Card>
                  <CardContent className="py-6">
                    <div className="text-center text-gray-500">
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
                  </CardContent>
                </Card>
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
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard/financing">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Financing Record"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
} 