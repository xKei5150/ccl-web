"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDataSchema } from "@/lib/schema";
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
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CircularPhotoUpload } from "@/components/ui/circular-photo-upload";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Home, Mail, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PersonalForm = ({
  defaultValues,
  onSubmit,
  submitText = "Submit Record",
  cancelRoute,
}) => {
  const form = useForm({
    resolver: zodResolver(personalDataSchema),
    defaultValues,
  });
  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-center mb-8">
              <FormField
                control={form.control}
                name="photo"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormControl>
                      <CircularPhotoUpload
                        onFileSelect={(file) => field.onChange(file)}
                        value={field.value}
                        className="w-32 h-32 hover:opacity-80 transition-opacity"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </h3>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="transition-all focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="middleName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="transition-all focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="transition-all focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            className="transition-all focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="localAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local Address</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[100px] transition-all focus:ring-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Personal Details
                  </h3>
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-all focus:ring-2">
                              <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Birth Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal transition-all focus:ring-2",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-all focus:ring-2">
                              <SelectValue placeholder="Select marital status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single">Single</SelectItem>
                            <SelectItem value="married">Married</SelectItem>
                            <SelectItem value="widowed">Widowed</SelectItem>
                            <SelectItem value="separated">Separated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="residencyStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residency Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-all focus:ring-2">
                              <SelectValue placeholder="Select residency status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="living with family/relatives">
                              Living with Family/Relatives
                            </SelectItem>
                            <SelectItem value="renting">Renting</SelectItem>
                            <SelectItem value="owned">Owned</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lifeStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Life Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="transition-all focus:ring-2">
                              <SelectValue placeholder="Select life status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="alive">Alive</SelectItem>
                            <SelectItem value="deceased">Deceased</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => cancelRoute && cancelRoute()}
              >
                Cancel
              </Button>
              <Button type="submit">{submitText}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PersonalForm;
