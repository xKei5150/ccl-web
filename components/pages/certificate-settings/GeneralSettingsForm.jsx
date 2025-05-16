'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/form/FormField";
import { FileUpload } from "@/components/ui/file-upload";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from 'next/image';
import { CertificateLayout } from "@/components/certificate/CertificateLayout";
import { BarangayResidencyCertificate } from "@/components/certificate/BarangayResidencyCertificate";

export default function GeneralSettingsForm({ settings = {}, images = {}, onSave, onImagesSave, isSaving }) {
  const [generalSettings, setGeneralSettings] = useState(settings);
  const [imageSettings, setImageSettings] = useState(images);
  
  // Live preview settings - combines current form state with initial settings
  const [previewSettings, setPreviewSettings] = useState({
    ...settings,
    ...images,
    images: imageSettings,
    general: generalSettings
  });
  
  // Update preview settings whenever form values change
  useEffect(() => {
    setPreviewSettings({
      ...settings,
      ...images,
      images: imageSettings,
      general: generalSettings
    });
  }, [generalSettings, imageSettings, settings, images]);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields like 'controlNumberPrefix.residency'
      const [parent, child] = name.split('.');
      setGeneralSettings({
        ...generalSettings,
        [parent]: {
          ...(generalSettings[parent] || {}),
          [child]: value
        }
      });
    } else {
      setGeneralSettings({
        ...generalSettings,
        [name]: value
      });
    }
  };

  const handleImageChange = (name, value) => {
    setImageSettings({
      ...imageSettings,
      [name]: value
    });
  };

  const handleSelectChange = (name, value) => {
    setImageSettings({
      ...imageSettings,
      [name]: value
    });
  };

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    onSave(generalSettings);
  };

  const handleImagesSubmit = (e) => {
    e.preventDefault();
    onImagesSave(imageSettings);
  };

  // Sample data for certificate preview
  const previewData = {
    person: {
      name: { 
        fullName: 'Juan Dela Cruz'
      },
      contact: {
        localAddress: '123 Main Street'
      },
      demographics: {
        birthDate: '1990-01-01',
        sex: 'Male',
        maritalStatus: 'Single'
      }
    },
    purpose: 'Employment',
    additionalInformation: {
      duration: '5 years'
    },
    createdAt: new Date().toISOString(),
    certificateDetails: {
      controlNumber: 'SAMPLE-2024-001',
      ctcDetails: {
        ctcNo: '12345678',
        ctcDateIssued: new Date().toISOString(),
        ctcAmount: 'PHP 100.00',
        ctcPlaceIssued: 'Malabanban Norte'
      },
      payment: {
        orNumber: 'OR-2024-001',
        amount: 'PHP 50.00'
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>General Certificate Settings</CardTitle>
          <CardDescription>Configure global settings that apply to all certificates</CardDescription>
        </CardHeader>
        <form onSubmit={handleGeneralSubmit}>
          <CardContent className="space-y-4">
            <FormField
              label="Default Citizenship"
              description="The default citizenship to use when not specified in personal information"
            >
              <Input
                name="defaultCitizenship"
                value={generalSettings.defaultCitizenship || ''}
                onChange={handleGeneralChange}
                placeholder="e.g., Filipino"
              />
            </FormField>
            
            <FormField
              label="Signature Label"
              description="Text that appears under the signature line"
            >
              <Input
                name="signatureLabel"
                value={generalSettings.signatureLabel || ''}
                onChange={handleGeneralChange}
                placeholder="e.g., Signature Over Printed Name of Client"
              />
            </FormField>
            
            <div className="border p-4 rounded-md space-y-4">
              <h3 className="font-medium">Control Number Prefixes</h3>
              
              <FormField label="Residency Certificate Prefix">
                <Input
                  name="controlNumberPrefix.residency"
                  value={generalSettings.controlNumberPrefix?.residency || ''}
                  onChange={handleGeneralChange}
                  placeholder="e.g., BRGY-RES"
                />
              </FormField>
              
              <FormField label="Indigency Certificate Prefix">
                <Input
                  name="controlNumberPrefix.indigency"
                  value={generalSettings.controlNumberPrefix?.indigency || ''}
                  onChange={handleGeneralChange}
                  placeholder="e.g., BRGY-IND"
                />
              </FormField>
              
              <FormField label="Clearance Certificate Prefix">
                <Input
                  name="controlNumberPrefix.clearance"
                  value={generalSettings.controlNumberPrefix?.clearance || ''}
                  onChange={handleGeneralChange}
                  placeholder="e.g., BC"
                />
              </FormField>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save General Settings'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Certificate Images</CardTitle>
          <CardDescription>Upload and manage images used in certificates</CardDescription>
        </CardHeader>
        <form onSubmit={handleImagesSubmit}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Barangay Logo"
                description="Upload the official barangay logo (recommended size: 200x200px)"
              >
                <FileUpload
                  value={imageSettings.barangayLogo}
                  onFileSelect={(files) => {
                    handleImageChange('barangayLogo', Array.isArray(files) ? files[0] : files);
                  }}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                  onRemove={() => handleImageChange('barangayLogo', null)}
                  previewSize="small"
                />
              </FormField>
              
              <FormField
                label="Philippine Seal/Flag"
                description="Upload the Philippine seal or flag image"
              >
                <FileUpload
                  value={imageSettings.philippineSeal}
                  onFileSelect={(files) => {
                    handleImageChange('philippineSeal', Array.isArray(files) ? files[0] : files);
                  }}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                  onRemove={() => handleImageChange('philippineSeal', null)}
                  previewSize="small"
                />
              </FormField>
              
              <FormField
                label="Official Seal (for clearance)"
                description="Upload the official barangay seal for clearance certificates"
              >
                <FileUpload
                  value={imageSettings.officialSeal}
                  onFileSelect={(files) => {
                    handleImageChange('officialSeal', Array.isArray(files) ? files[0] : files);
                  }}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                  onRemove={() => handleImageChange('officialSeal', null)}
                  previewSize="small"
                />
              </FormField>
              
              <FormField
                label="Barangay Captain Signature"
                description="Upload a digital signature image (PNG with transparent background recommended)"
              >
                <FileUpload
                  value={imageSettings.captainSignature}
                  onFileSelect={(files) => {
                    handleImageChange('captainSignature', Array.isArray(files) ? files[0] : files);
                  }}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                  onRemove={() => handleImageChange('captainSignature', null)}
                  previewSize="small"
                />
              </FormField>
            </div>

            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Background Image Options</h3>
              
              <FormField
                label="Certificate Background Image"
                description="Upload a background image that will be displayed with reduced opacity"
              >
                <FileUpload
                  value={imageSettings.backgroundImage}
                  onFileSelect={(files) => {
                    handleImageChange('backgroundImage', Array.isArray(files) ? files[0] : files);
                  }}
                  accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
                  onRemove={() => handleImageChange('backgroundImage', null)}
                />
              </FormField>
              
              {imageSettings.backgroundImage && (
                <FormField
                  label="Background Opacity"
                  description="Control how visible the background image appears"
                >
                  <Select
                    value={imageSettings.backgroundOpacity || '10'}
                    onValueChange={(value) => handleSelectChange('backgroundOpacity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select opacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Very Light (5%)</SelectItem>
                      <SelectItem value="10">Light (10%)</SelectItem>
                      <SelectItem value="15">Medium (15%)</SelectItem>
                      <SelectItem value="20">Strong (20%)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Image Settings'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Certificate Preview</CardTitle>
          <CardDescription>Preview how your certificates will look with the current settings (updates live as you make changes)</CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden bg-gray-50">
          <div className="scale-[0.75] origin-top-left">
            <BarangayResidencyCertificate 
              requestData={previewData}
              settings={previewSettings}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50/50 text-sm text-muted-foreground pt-3">
          <p>This is a sample preview using the Barangay Residency certificate type.</p>
        </CardFooter>
      </Card>
    </div>
  );
} 