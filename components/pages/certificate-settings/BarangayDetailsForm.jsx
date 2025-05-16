'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/form/FormField";

export default function BarangayDetailsForm({ settings = {}, onSave, isSaving }) {
  const [formData, setFormData] = useState(settings);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barangay Information</CardTitle>
        <CardDescription>
          Update the barangay details that appear in the header and footer of certificates
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Header Text"
              description="The top line of the certificate header"
            >
              <Input
                name="headerText"
                value={formData.headerText || ''}
                onChange={handleChange}
                placeholder="e.g., Republic of the Philippines"
              />
            </FormField>
            
            <FormField
              label="Province"
              description="The province name"
            >
              <Input
                name="province"
                value={formData.province || ''}
                onChange={handleChange}
                placeholder="e.g., Quezon"
              />
            </FormField>
            
            <FormField
              label="Municipality"
              description="The municipality name"
            >
              <Input
                name="municipality"
                value={formData.municipality || ''}
                onChange={handleChange}
                placeholder="e.g., Candelaria"
              />
            </FormField>
            
            <FormField
              label="Barangay Name"
              description="The barangay name (typically in all caps)"
            >
              <Input
                name="barangayName"
                value={formData.barangayName || ''}
                onChange={handleChange}
                placeholder="e.g., MALABANBAN NORTE"
              />
            </FormField>
          </div>
          
          <FormField
            label="Barangay Address"
            description="The complete address shown in the footer"
          >
            <Input
              name="barangayAddress"
              value={formData.barangayAddress || ''}
              onChange={handleChange}
              placeholder="e.g., Tibanglan Road Malabanban Norte, Candelaria, Quezon"
            />
          </FormField>
          
          <FormField
            label="Contact Number"
            description="The contact number shown in the footer"
          >
            <Input
              name="contactNumber"
              value={formData.contactNumber || ''}
              onChange={handleChange}
              placeholder="e.g., (042) 585-5423"
            />
          </FormField>
          
          <FormField
            label="Tagline"
            description="The motto or tagline shown at the bottom of the certificate"
          >
            <Input
              name="tagline"
              value={formData.tagline || ''}
              onChange={handleChange}
              placeholder="e.g., Madaling lapitan, maaasahan sa oras ng pangangailangan"
            />
          </FormField>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
} 