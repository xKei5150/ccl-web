'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { FormField } from "@/components/form/FormField";

export default function OfficialsForm({ settings = {}, onSave, isSaving }) {
  const [formData, setFormData] = useState(settings);

  const handleChange = (e, section, field) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [section]: {
        ...(formData[section] || {}),
        [field]: value
      }
    });
  };

  const handleCouncilorChange = (index, field, value) => {
    const updatedCouncilors = [...(formData.councilors || [])];
    
    // Ensure the councilor object exists
    if (!updatedCouncilors[index]) {
      updatedCouncilors[index] = {};
    }
    
    // Update the specific field
    updatedCouncilors[index][field] = value;
    
    // Update state
    setFormData({
      ...formData,
      councilors: updatedCouncilors
    });
  };

  const addCouncilor = () => {
    setFormData({
      ...formData,
      councilors: [
        ...(formData.councilors || []),
        { name: '', chairmanship: '' }
      ]
    });
  };

  const removeCouncilor = (index) => {
    const updatedCouncilors = [...(formData.councilors || [])];
    updatedCouncilors.splice(index, 1);
    
    setFormData({
      ...formData,
      councilors: updatedCouncilors
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barangay Officials</CardTitle>
        <CardDescription>
          Update the names and titles of barangay officials that appear on certificates
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Barangay Captain */}
          <div className="border p-4 rounded-md">
            <h3 className="font-medium mb-4">Barangay Captain</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Name">
                <Input
                  value={(formData.captain?.name) || ''}
                  onChange={(e) => handleChange(e, 'captain', 'name')}
                  placeholder="e.g., CONVERSION M. LAMOCA"
                />
              </FormField>
              
              <FormField label="Title">
                <Input
                  value={(formData.captain?.title) || ''}
                  onChange={(e) => handleChange(e, 'captain', 'title')}
                  placeholder="e.g., Punong Barangay"
                />
              </FormField>
            </div>
          </div>
          
          {/* Councilors */}
          <div className="border p-4 rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Councilors</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addCouncilor}
              >
                <PlusIcon className="h-4 w-4 mr-1" /> Add Councilor
              </Button>
            </div>
            
            {(formData.councilors || []).map((councilor, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-4 mb-4 items-start">
                <FormField label="Name" className="mb-0">
                  <Input
                    value={councilor.name || ''}
                    onChange={(e) => handleCouncilorChange(index, 'name', e.target.value)}
                    placeholder="Councilor Name"
                  />
                </FormField>
                
                <FormField label="Chairmanship/Role" className="mb-0">
                  <Input
                    value={councilor.chairmanship || ''}
                    onChange={(e) => handleCouncilorChange(index, 'chairmanship', e.target.value)}
                    placeholder="e.g., Chairman of Peace & Order"
                  />
                </FormField>
                
                <div className="pt-8">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCouncilor(index)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2Icon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
            
            {(formData.councilors || []).length === 0 && (
              <p className="text-sm text-muted-foreground italic">No councilors added. Click the button above to add councilors.</p>
            )}
          </div>
          
          {/* Other Officials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SK Chairman */}
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-4">SK Chairman</h3>
              <div className="space-y-4">
                <FormField label="Name">
                  <Input
                    value={(formData.skChairman?.name) || ''}
                    onChange={(e) => handleChange(e, 'skChairman', 'name')}
                    placeholder="e.g., GERALDINE L. BELEN"
                  />
                </FormField>
                
                <FormField label="Title">
                  <Input
                    value={(formData.skChairman?.title) || ''}
                    onChange={(e) => handleChange(e, 'skChairman', 'title')}
                    placeholder="e.g., SK Chairman"
                  />
                </FormField>
              </div>
            </div>
            
            {/* Secretary */}
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-4">Barangay Secretary</h3>
              <div className="space-y-4">
                <FormField label="Name">
                  <Input
                    value={(formData.secretary?.name) || ''}
                    onChange={(e) => handleChange(e, 'secretary', 'name')}
                    placeholder="e.g., HAZEL GRACE M. AGUDA"
                  />
                </FormField>
                
                <FormField label="Title">
                  <Input
                    value={(formData.secretary?.title) || ''}
                    onChange={(e) => handleChange(e, 'secretary', 'title')}
                    placeholder="e.g., Barangay Secretary"
                  />
                </FormField>
              </div>
            </div>
            
            {/* Treasurer */}
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-4">Barangay Treasurer</h3>
              <div className="space-y-4">
                <FormField label="Name">
                  <Input
                    value={(formData.treasurer?.name) || ''}
                    onChange={(e) => handleChange(e, 'treasurer', 'name')}
                    placeholder="e.g., NORELYN D. SARAZA"
                  />
                </FormField>
                
                <FormField label="Title">
                  <Input
                    value={(formData.treasurer?.title) || ''}
                    onChange={(e) => handleChange(e, 'treasurer', 'title')}
                    placeholder="e.g., Barangay Treasurer"
                  />
                </FormField>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Officials'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 