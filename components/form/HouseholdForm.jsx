"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { householdSchema } from "@/lib/schema";
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
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

const HouseholdForm = ({
  defaultValues,
  onSubmit,
  submitText = "Submit Record",
  cancelRoute,
}) => {
  const form = useForm({
    resolver: zodResolver(householdSchema),
    defaultValues,
  });

  const {
    fields: membersField,
    append: appendPerson,
    remove: removePerson,
  } = useFieldArray({
    control: form.control,
    name: "members",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="familyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Members</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendPerson({
                  name: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          {membersField.map((field, index) => (
            <div
              key={field.id}
              className="space-y-4 p-4 border rounded-lg relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removePerson(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <FormField
                control={form.control}
                name={`members.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="localAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="residencyDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Residency Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
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
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
  );
};
export default HouseholdForm;
