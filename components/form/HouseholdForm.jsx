"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  User, 
  Home, 
  CircleCheck, 
  MapPin, 
  Calendar, 
  Users 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomDatePicker from "@/components/fields/CustomDatePicker";
import { PersonalInfoSelect } from "./PersonalInfoSelect";
import * as React from "react";
import { Separator } from "@/components/ui/separator";

const householdSchema = z.object({
  familyName: z.string().min(1, "Family name is required"),
  members: z.array(z.any()),
  localAddress: z.string().min(1, "Local address is required"),
  status: z.enum(["active", "inactive"]),
  residencyDate: z.string().optional(),
});

export default function HouseholdForm({
  defaultValues,
  onSubmit,
  submitText = "Submit Record",
  cancelRoute,
}) {
  const form = useForm({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      familyName: "",
      members: [],
      localAddress: "",
      status: "active",
      residencyDate: new Date(),
      ...defaultValues,
    },
  });

  const {
    fields: membersFields,
    append: appendMember,
    remove: removeMember,
  } = useFieldArray({
    control: form.control,
    name: "members",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              <CardTitle>Basic Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="familyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      Family Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter family name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CircleCheck className="h-4 w-4 text-muted-foreground" />
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="localAddress"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Local Address
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter complete address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="residencyDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      Residency Date
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Household Members */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Household Members</CardTitle>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendMember({ member: {} })}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Member
              </Button>
            </div>
            <Separator className="mt-3" />
          </CardHeader>
          <CardContent className="space-y-4">
            {membersFields.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No members added yet
              </div>
            ) : (
              membersFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-background/50"
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <FormField
                    control={form.control}
                    name={`members.${index}.member`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="sr-only">Member</FormLabel>
                        <FormControl>
                          <PersonalInfoSelect
                            onSelect={field.onChange}
                            defaultValue={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember(index)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={cancelRoute}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}