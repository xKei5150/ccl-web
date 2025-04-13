"use client";

import { useState } from "react";
import { ContentLayout } from "@/components/layout/page-layout";
import { FormLayout, FormSection, FormGroup, FormField, FormActions } from "@/components/form/form-layout";
import { CardGrid } from "@/components/layout/grid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardImage } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUrlFilters } from "@/hooks/use-url-state";
import { useData } from "@/hooks/use-data";

/**
 * Example component demonstrating standardized page architecture
 */
export function StandardPageExample() {
  // URL-based filters
  const { filters, updateFilters, resetFilters } = useUrlFilters({
    search: "",
    category: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Example data fetching
  const { data, isLoading, error } = useData(
    async () => {
      // Simulated API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { id: 1, title: "Item 1", description: "Description 1", image: "/placeholder.jpg" },
            { id: 2, title: "Item 2", description: "Description 2", image: "/placeholder.jpg" },
            { id: 3, title: "Item 3", description: "Description 3", image: "/placeholder.jpg" },
          ]);
        }, 1000);
      });
    },
    { immediate: true }
  );

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  // Search handler
  const handleSearch = (e) => {
    updateFilters({ search: e.target.value });
  };

  return (
    <ContentLayout
      title="Standardized Page Example"
      description="This page demonstrates standardized components and layouts"
      actions={
        <>
          <Button variant="outline" onClick={resetFilters}>
            Reset
          </Button>
          <Button>New Item</Button>
        </>
      }
    >
      {/* Search and Filter Section */}
      <FormSection title="Search and Filters" description="Filter the results below">
        <FormGroup columns={2}>
          <FormField label="Search">
            <Input 
              placeholder="Search items..." 
              value={filters.search || ""} 
              onChange={handleSearch}
            />
          </FormField>
          <FormField label="Category">
            <Input 
              placeholder="Select category..." 
              value={filters.category || ""} 
              onChange={(e) => updateFilters({ category: e.target.value })}
            />
          </FormField>
        </FormGroup>
      </FormSection>

      {/* Content Cards */}
      <FormSection title="Items" description="Browse available items">
        {isLoading ? (
          <p>Loading items...</p>
        ) : error ? (
          <p>Error loading items: {error.message}</p>
        ) : (
          <CardGrid mobile={1} tablet={2} desktop={3}>
            {data?.map((item) => (
              <Card key={item.id}>
                <CardImage src={item.image} alt={item.title} />
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Additional content goes here</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Select</Button>
                </CardFooter>
              </Card>
            ))}
          </CardGrid>
        )}
      </FormSection>

      {/* Form Example */}
      <FormSection title="Example Form" description="Demonstrates standardized form layout">
        <form onSubmit={handleSubmit}>
          <FormLayout>
            <FormGroup>
              <FormField label="Name" description="Your full name">
                <Input 
                  name="name"
                  placeholder="Enter your name" 
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </FormField>
              <FormField label="Email" description="Your email address">
                <Input 
                  name="email"
                  type="email"
                  placeholder="Enter your email" 
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </FormField>
            </FormGroup>
            <FormActions>
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">Submit</Button>
            </FormActions>
          </FormLayout>
        </form>
      </FormSection>
    </ContentLayout>
  );
} 