"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Schema for validation
const ageGroupSchema = z.object({
  ageRange: z.string().min(1, "Age range is required"),
  count: z.coerce.number().min(0, "Count must be a positive number"),
});

const diseaseSchema = z.object({
  diseaseName: z.string().min(1, "Disease name is required"),
  count: z.coerce.number().min(0, "Count must be a positive number"),
});

const demographicSchema = z.object({
  year: z.coerce.number()
    .min(1900, "Year must be 1900 or later")
    .max(2100, "Year must be 2100 or earlier"),
  maleCount: z.coerce.number().min(0, "Male count must be a positive number"),
  femaleCount: z.coerce.number().min(0, "Female count must be a positive number"),
  householdsCount: z.coerce.number().min(0, "Households count must be a positive number").optional(),
  voterCount: z.coerce.number().min(0, "Voter count must be a positive number").optional(),
  pwdCount: z.coerce.number().min(0, "PWD count must be a positive number").optional(),
  ageGroups: z.array(ageGroupSchema),
  chronicDiseases: z.array(diseaseSchema),
});

export default function DemographicForm({
  defaultValues = {
    year: new Date().getFullYear(),
    maleCount: "",
    femaleCount: "",
    householdsCount: "",
    voterCount: "",
    pwdCount: "",
    ageGroups: [
      { ageRange: "0-5", count: "" },
      { ageRange: "6-17", count: "" },
      { ageRange: "18-59", count: "" },
      { ageRange: "60+", count: "" }
    ],
    chronicDiseases: [],
  },
  onSubmit,
  submitText = "Submit Record",
  cancelRoute,
  yearError = null,
  onYearChange = null,
}) {
  const form = useForm({
    resolver: zodResolver(demographicSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields: ageGroupFields, append: appendAgeGroup, remove: removeAgeGroup } = useFieldArray({
    control: form.control,
    name: "ageGroups"
  });

  const { fields: diseaseFields, append: appendDisease, remove: removeDisease } = useFieldArray({
    control: form.control,
    name: "chronicDiseases"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPopulation, setTotalPopulation] = useState(0);
  const [ageGroupsTotal, setAgeGroupsTotal] = useState(0);
  const [ageGroupsExceedTotal, setAgeGroupsExceedTotal] = useState(false);

  // Use useWatch for real-time updates
  const year = useWatch({
    control: form.control,
    name: "year",
    defaultValue: defaultValues.year,
  });
  
  const maleCount = useWatch({
    control: form.control,
    name: "maleCount",
    defaultValue: defaultValues.maleCount,
  });
  
  const femaleCount = useWatch({
    control: form.control,
    name: "femaleCount",
    defaultValue: defaultValues.femaleCount,
  });
  
  const ageGroups = useWatch({
    control: form.control,
    name: "ageGroups",
    defaultValue: defaultValues.ageGroups,
  });

  // Check for year uniqueness when the year changes
  useEffect(() => {
    if (onYearChange && year) {
      const checkYearDebounced = setTimeout(() => {
        onYearChange(year);
      }, 500); // Debounce to avoid too many server calls
      
      return () => clearTimeout(checkYearDebounced);
    }
  }, [year, onYearChange]);

  // Calculate total population whenever male or female count changes
  useEffect(() => {
    const total = (Number(maleCount) || 0) + (Number(femaleCount) || 0);
    setTotalPopulation(total);
  }, [maleCount, femaleCount]);

  // Calculate age groups total whenever any age group count changes
  useEffect(() => {
    if (!ageGroups) return;
    
    // Calculate sum of all age group counts
    const total = ageGroups.reduce((sum, group) => {
      return sum + (Number(group.count) || 0);
    }, 0);
    
    setAgeGroupsTotal(total);
    
    // Check if total exceeds population
    if (totalPopulation > 0) {
      setAgeGroupsExceedTotal(total > totalPopulation);
    }
  }, [ageGroups, totalPopulation]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Add calculated total population to the data
      const submissionData = {
        ...data,
        totalPopulation: totalPopulation
      };
      await onSubmit(submissionData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        placeholder="Enter year"
                        className={yearError ? "border-red-500" : ""} 
                      />
                    </FormControl>
                    {yearError ? (
                      <div className="text-red-500 text-sm mt-1">{yearError}</div>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maleCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Male Population</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Enter male count" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="femaleCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Female Population</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Enter female count" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-1 md:col-span-3 bg-blue-50 p-4 rounded-md flex items-center space-x-2">
                <div className="font-medium">Total Population: {totalPopulation}</div>
                <div className="text-sm text-gray-500">(Calculated from Male + Female)</div>
              </div>

              <FormField
                control={form.control}
                name="householdsCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Households</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Enter households count" />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voterCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registered Voters</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Enter voter count" />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pwdCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Persons with Disability (PWD)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Enter PWD count" />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Age Groups Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Age Groups</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendAgeGroup({
                    ageRange: "",
                    count: "",
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Age Group
                </Button>
              </div>

              {ageGroupsExceedTotal && (
                <Alert variant="warning" className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    The sum of age groups ({ageGroupsTotal}) exceeds the total population ({totalPopulation}).
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm flex justify-between">
                <div>Age Groups Total: {ageGroupsTotal}</div>
                <div>Total Population: {totalPopulation}</div>
              </div>

              {ageGroupFields.map((field, index) => (
                <Card key={field.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`ageGroups.${index}.ageRange`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age Range</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 0-5, 6-17, 18-59, 60+" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`ageGroups.${index}.count`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Count</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl className="flex-1">
                                <Input 
                                  type="number" 
                                  {...field} 
                                  placeholder="Enter count"
                                  onChange={(e) => {
                                    field.onChange(e);
                                    // Force immediate update
                                    form.trigger(`ageGroups.${index}.count`);
                                  }}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={() => removeAgeGroup(index)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chronic Diseases Section */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Chronic Diseases</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendDisease({
                    diseaseName: "",
                    count: "",
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Disease
                </Button>
              </div>

              {diseaseFields.map((field, index) => (
                <Card key={field.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`chronicDiseases.${index}.diseaseName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Disease Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Diabetes, Hypertension" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`chronicDiseases.${index}.count`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Count</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl className="flex-1">
                                <Input 
                                  type="number" 
                                  {...field} 
                                  placeholder="Enter count" 
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-red-500"
                                onClick={() => removeDisease(index)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          {cancelRoute && (
            <Button
              type="button"
              variant="outline"
              onClick={cancelRoute}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || yearError}>
            {isSubmitting ? "Submitting..." : submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
} 