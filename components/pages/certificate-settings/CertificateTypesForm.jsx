'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/form/FormField";

export default function CertificateTypesForm({ settings = {}, onSave, isSaving }) {
  const [formData, setFormData] = useState(settings);

  const handleChange = (certificateType, field, value) => {
    setFormData({
      ...formData,
      [certificateType]: {
        ...(formData[certificateType] || {}),
        [field]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate Type Settings</CardTitle>
        <CardDescription>
          Configure text content for each certificate type
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Tabs defaultValue="residency" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="residency">Residency</TabsTrigger>
              <TabsTrigger value="indigency">Indigency</TabsTrigger>
              <TabsTrigger value="clearance">Clearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="residency" className="space-y-4">
              <FormField
                label="Certificate Title"
                description="The title displayed at the top of the certificate"
              >
                <Input
                  value={(formData.residency?.title) || ''}
                  onChange={(e) => handleChange('residency', 'title', e.target.value)}
                  placeholder="e.g., BARANGAY RESIDENCY"
                />
              </FormField>
              
              <FormField
                label="Body Text"
                description="The main content of the certificate explaining residency"
              >
                <Textarea
                  value={(formData.residency?.bodyText) || ''}
                  onChange={(e) => handleChange('residency', 'bodyText', e.target.value)}
                  placeholder="Enter the main body text for residency certificates"
                  rows={3}
                />
              </FormField>
              
              <FormField
                label="Purpose Text"
                description="The text explaining the purpose/usage of the certificate"
              >
                <Textarea
                  value={(formData.residency?.purposeText) || ''}
                  onChange={(e) => handleChange('residency', 'purposeText', e.target.value)}
                  placeholder="Enter the purpose text for residency certificates"
                  rows={3}
                />
              </FormField>
              
              <FormField
                label="Default Validity"
                description="The default validity period for this certificate"
              >
                <Input
                  value={(formData.residency?.defaultValidity) || ''}
                  onChange={(e) => handleChange('residency', 'defaultValidity', e.target.value)}
                  placeholder="e.g., 6 months"
                />
              </FormField>
            </TabsContent>
            
            <TabsContent value="indigency" className="space-y-4">
              <FormField
                label="Certificate Title"
                description="The title displayed at the top of the certificate"
              >
                <Input
                  value={(formData.indigency?.title) || ''}
                  onChange={(e) => handleChange('indigency', 'title', e.target.value)}
                  placeholder="e.g., BARANGAY INDIGENCY"
                />
              </FormField>
              
              <FormField
                label="Regular Body Text"
                description="The main content for standard indigency certificates"
              >
                <Textarea
                  value={(formData.indigency?.regularBodyText) || ''}
                  onChange={(e) => handleChange('indigency', 'regularBodyText', e.target.value)}
                  placeholder="Enter the main body text for regular indigency certificates"
                  rows={3}
                />
              </FormField>
              
              <FormField
                label="Medical Assistance Body Text"
                description="The main content for medical assistance indigency certificates"
              >
                <Textarea
                  value={(formData.indigency?.medicalBodyText) || ''}
                  onChange={(e) => handleChange('indigency', 'medicalBodyText', e.target.value)}
                  placeholder="Enter the body text for medical assistance indigency certificates"
                  rows={3}
                />
              </FormField>
              
              <FormField
                label="Regular Purpose Text"
                description="The purpose text for regular indigency certificates"
              >
                <Textarea
                  value={(formData.indigency?.regularPurposeText) || ''}
                  onChange={(e) => handleChange('indigency', 'regularPurposeText', e.target.value)}
                  placeholder="Enter the purpose text for regular indigency certificates"
                  rows={3}
                />
              </FormField>
              
              <FormField
                label="Medical Purpose Text"
                description="The purpose text for medical assistance indigency certificates"
              >
                <Textarea
                  value={(formData.indigency?.medicalPurposeText) || ''}
                  onChange={(e) => handleChange('indigency', 'medicalPurposeText', e.target.value)}
                  placeholder="Enter the purpose text for medical assistance indigency certificates"
                  rows={3}
                />
              </FormField>
            </TabsContent>
            
            <TabsContent value="clearance" className="space-y-4">
              <FormField
                label="Certificate Title"
                description="The title displayed at the top of the certificate"
              >
                <Input
                  value={(formData.clearance?.title) || ''}
                  onChange={(e) => handleChange('clearance', 'title', e.target.value)}
                  placeholder="e.g., BARANGAY CLEARANCE"
                />
              </FormField>
              
              <FormField
                label="Body Text"
                description="The main content of the clearance certificate"
              >
                <Textarea
                  value={(formData.clearance?.bodyText) || ''}
                  onChange={(e) => handleChange('clearance', 'bodyText', e.target.value)}
                  placeholder="Enter the main body text for clearance certificates"
                  rows={3}
                />
              </FormField>
              
              <FormField
                label="Purpose Text"
                description="The text explaining the purpose of the clearance"
              >
                <Textarea
                  value={(formData.clearance?.purposeText) || ''}
                  onChange={(e) => handleChange('clearance', 'purposeText', e.target.value)}
                  placeholder="Enter the purpose text for clearance certificates"
                  rows={3}
                />
              </FormField>
              
              <FormField
                label="Default Validity Period"
                description="The default validity period for clearance certificates"
              >
                <Input
                  value={(formData.clearance?.defaultValidity) || ''}
                  onChange={(e) => handleChange('clearance', 'defaultValidity', e.target.value)}
                  placeholder="e.g., Six (6) Months"
                />
              </FormField>
              
              <FormField
                label="Thumbmark Label"
                description="The text shown beside the thumbmark area"
              >
                <Input
                  value={(formData.clearance?.thumbMarkLabel) || ''}
                  onChange={(e) => handleChange('clearance', 'thumbMarkLabel', e.target.value)}
                  placeholder="e.g., Applicant's Right Thumb Mark"
                />
              </FormField>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Certificate Settings'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 